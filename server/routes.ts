import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertCandidateSchema } from "@shared/schema";

// Almacenamiento temporal en memoria para resultados pendientes
const pendingResults = new Map<string, {
  status: 'processing' | 'completed' | 'error';
  result?: any;
  timestamp: number;
}>();

// Sistema de rate limiting con cola de espera
class RequestQueue {
  private activeRequests = 0;
  private readonly maxConcurrent = 10;
  private queue: Array<() => void> = [];

  async executeWithLimit<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const execute = async () => {
        this.activeRequests++;
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
          this.processQueue();
        }
      };

      if (this.activeRequests < this.maxConcurrent) {
        execute();
      } else {
        this.queue.push(execute);
      }
    });
  }

  private processQueue() {
    if (this.queue.length > 0 && this.activeRequests < this.maxConcurrent) {
      const nextRequest = this.queue.shift();
      if (nextRequest) {
        nextRequest();
      }
    }
  }

  getStatus() {
    return {
      activeRequests: this.activeRequests,
      queuedRequests: this.queue.length,
      maxConcurrent: this.maxConcurrent
    };
  }
}

const requestQueue = new RequestQueue();

// Sistema de rate limiting por IP
class IPRateLimiter {
  private requests = new Map<string, Array<number>>();
  private readonly maxRequests = 25; // máximo 25 peticiones para permitir polling
  private readonly windowMs = 60 * 1000; // por minuto
  private readonly cleanupInterval = 5 * 60 * 1000; // limpiar cada 5 minutos

  constructor() {
    // Limpiar IPs antiguos periódicamente
    setInterval(() => {
      const now = Date.now();
      this.requests.forEach((timestamps, ip) => {
        const validTimestamps = timestamps.filter(t => now - t < this.windowMs);
        if (validTimestamps.length === 0) {
          this.requests.delete(ip);
        } else {
          this.requests.set(ip, validTimestamps);
        }
      });
    }, this.cleanupInterval);
  }

  isAllowed(ip: string): boolean {
    const now = Date.now();
    const ipRequests = this.requests.get(ip) || [];
    
    // Filtrar peticiones dentro de la ventana de tiempo
    const recentRequests = ipRequests.filter(timestamp => now - timestamp < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    // Agregar esta petición
    recentRequests.push(now);
    this.requests.set(ip, recentRequests);
    return true;
  }

  getRemainingRequests(ip: string): number {
    const now = Date.now();
    const ipRequests = this.requests.get(ip) || [];
    const recentRequests = ipRequests.filter(timestamp => now - timestamp < this.windowMs);
    return Math.max(0, this.maxRequests - recentRequests.length);
  }

  getResetTime(ip: string): number {
    const ipRequests = this.requests.get(ip) || [];
    if (ipRequests.length === 0) return 0;
    
    const oldestRequest = Math.min(...ipRequests);
    return oldestRequest + this.windowMs;
  }

  getStatus() {
    return {
      maxRequests: this.maxRequests,
      windowMs: this.windowMs,
      activeIPs: this.requests.size,
      totalTrackedRequests: Array.from(this.requests.values()).reduce((sum, arr) => sum + arr.length, 0)
    };
  }
}

const ipLimiter = new IPRateLimiter();

// Sistema de autenticación por API Keys (solo lectura desde env)
class APIKeyManager {
  private validKeys = new Set<string>();
  private keyUsage = new Map<string, { count: number; lastUsed: number; }>();

  constructor() {
    this.loadKeysFromEnv();
  }

  private loadKeysFromEnv(): void {
    // Cargar API keys desde variables de entorno
    const envKeys = process.env.API_KEYS?.split(',').map(k => k.trim()).filter(k => k.length > 0);
    
    this.validKeys.clear(); // Limpiar keys existentes
    
    if (envKeys && envKeys.length > 0) {
      envKeys.forEach(key => this.validKeys.add(key));
      console.log(`🔑 Loaded ${envKeys.length} API keys from environment`);
    } else {
      console.warn('⚠️ No API keys configured in API_KEYS environment variable');
    }
  }

  isValidKey(key: string): boolean {
    return this.validKeys.has(key);
  }

  trackUsage(key: string): void {
    if (!this.isValidKey(key)) return;
    
    const usage = this.keyUsage.get(key) || { count: 0, lastUsed: 0 };
    usage.count++;
    usage.lastUsed = Date.now();
    this.keyUsage.set(key, usage);
  }

  getStats() {
    return {
      totalKeys: this.validKeys.size,
      usage: Object.fromEntries(this.keyUsage)
    };
  }

  // Método para recargar keys desde variables de entorno (útil para updates)
  reloadKeys(): void {
    this.loadKeysFromEnv();
  }
}

const apiKeyManager = new APIKeyManager();

// Limpiar resultados antiguos cada 30 minutos
setInterval(() => {
  const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
  const idsToDelete: string[] = [];
  pendingResults.forEach((data, id) => {
    if (data.timestamp < thirtyMinutesAgo) {
      idsToDelete.push(id);
    }
  });
  idsToDelete.forEach(id => pendingResults.delete(id));
}, 30 * 60 * 1000);

// Middleware de autenticación por API Key
function apiKeyMiddleware(req: any, res: any, next: any) {
  const authHeader = req.get('Authorization');
  let apiKey = null;
  
  // Extraer API key del header Authorization (formato: Bearer token)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7); // Remover "Bearer "
  }
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key required. Include Authorization: Bearer <api_key> header.'
    });
  }

  if (!apiKeyManager.isValidKey(apiKey)) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key.'
    });
  }

  // Rastrear uso de la API key
  apiKeyManager.trackUsage(apiKey);
  
  // Agregar información del API key al request para logs
  req.apiKey = apiKey;
  
  next();
}

// Middleware de rate limiting por IP
function rateLimitMiddleware(req: any, res: any, next: any) {
  // Obtener IP real del cliente
  const ip = req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           req.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
           req.get('X-Real-IP') ||
           'unknown';

  if (!ipLimiter.isAllowed(ip)) {
    const resetTime = ipLimiter.getResetTime(ip);
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
    
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Try again later.',
      retryAfter: retryAfter > 0 ? retryAfter : 60,
      limit: 5,
      window: '1 minute'
    });
  }

  // Agregar headers informativos
  res.set({
    'X-RateLimit-Limit': '5',
    'X-RateLimit-Remaining': ipLimiter.getRemainingRequests(ip).toString(),
    'X-RateLimit-Reset': new Date(ipLimiter.getResetTime(ip)).toISOString()
  });

  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint para verificar estado de iframe y dominios permitidos
  app.get("/api/debug/iframe-status", async (req, res) => {
    try {
      const referer = req.get('Referer') || '';
      const origin = req.get('Origin') || '';
      const host = req.get('Host') || '';
      
      // Obtener dominios permitidos de variables de entorno
      const allowedDomains = process.env.ALLOWED_DOMAINS?.split(',').map(d => d.trim()) || [
        'https://manual-upload.apli.app/',
        'https://demo.apli.app/',
        'https://apli.app/',
        'https://recruitment.apli.app/',
        'https://manual-upload-apli.replit.app/',
        'https://replit.com/',
        'replit.dev',
        'replit.app'
      ];
      
      // Determinar si está en iframe
      const isInIframe = referer && referer !== `${req.protocol}://${host}${req.originalUrl}`;
      
      // Verificar si el dominio está permitido
      let isAllowed = true;
      if (isInIframe && referer) {
        try {
          const referrerUrl = new URL(referer);
          const referrerDomain = referrerUrl.hostname;
          
          isAllowed = allowedDomains.some(domain => {
            // Remover protocolo y trailing slash si existe en el dominio permitido
            const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
            
            if (cleanDomain.startsWith('*.')) {
              const baseDomain = cleanDomain.substring(2);
              return referrerDomain.endsWith(baseDomain);
            }
            return referrerDomain === cleanDomain || referrerDomain.includes(cleanDomain);
          });
          
          // Verificar dominios específicos de APLI y Replit
          const apliDomains = ['manual-upload.apli.app', 'demo.apli.app', 'apli.app', 'recruitment.apli.app', 'manual-upload-apli.replit.app'];
          const replitDomains = ['replit.dev', 'replit.app', 'replit.com'];
          
          if (!isAllowed) {
            isAllowed = apliDomains.some(domain => referrerDomain.includes(domain)) ||
                       replitDomains.some(domain => referrerDomain.includes(domain));
          }
        } catch (e) {
          // Si hay error parseando la URL, asumir que está permitido
          isAllowed = true;
        }
      }
      
      res.json({
        isInIframe,
        referer,
        origin,
        host,
        isAllowed,
        allowedDomains,
        testingMode: process.env.TESTING_MODE === 'true'
      });
    } catch (error) {
      res.status(500).json({ error: "Error checking iframe status" });
    }
  });

  // Endpoint de salud para verificar el estado del servidor
  app.get("/api/health", async (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });



  // API simplificada para validación del formulario
  app.post("/api/candidates", apiKeyMiddleware, rateLimitMiddleware, async (req, res) => {
    try {
      // Validar datos del formulario
      const validatedData = await insertCandidateSchema.parseAsync(req.body);
      
      // Simular guardado exitoso (para el formulario actual)
      res.json({ 
        success: true, 
        message: "Candidato recibido correctamente",
        id: Date.now() // ID temporal para pruebas
      });
    } catch (error) {
      console.error("Error validating candidate:", error);
      res.status(400).json({ 
        error: "Error de validación", 
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  });

  // Endpoint para recibir resultados de n8n (callback asíncrono)
  app.post("/api/webhook-result", async (req, res) => {
    try {
      const { candidate_submission_id, status, result } = req.body;
      
      if (!candidate_submission_id) {
        return res.status(400).json({ error: "candidate_submission_id requerido" });
      }

      // Actualizar el resultado en memoria preservando la estructura completa
      pendingResults.set(candidate_submission_id, {
        status: status === 'success' ? 'completed' : 'error',
        result: result || req.body.result || req.body,
        timestamp: Date.now()
      });

      res.json({ success: true, message: "Resultado recibido" });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint para verificar el estado de un procesamiento (polling)
  app.get("/api/check-status/:candidate_submission_id", apiKeyMiddleware, async (req, res) => {
    try {
      const { candidate_submission_id } = req.params;
      const result = pendingResults.get(candidate_submission_id);
      
      if (!result) {
        return res.json({ 
          status: 'not_found',
          message: 'ID de candidato no encontrado o expirado'
        });
      }

      res.json({
        status: result.status,
        result: result.result,
        timestamp: result.timestamp
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint para cancelar un procesamiento (liquidar polling)
  app.delete("/api/cancel-processing/:candidate_submission_id", async (req, res) => {
    try {
      const { candidate_submission_id } = req.params;
      
      if (pendingResults.has(candidate_submission_id)) {
        pendingResults.set(candidate_submission_id, {
          status: 'error',
          result: { 
            error: 'Procesamiento cancelado por el usuario',
            message: 'La operación fue cancelada manualmente'
          },
          timestamp: Date.now()
        });
        
        res.json({ 
          success: true, 
          message: 'Procesamiento cancelado exitosamente' 
        });
      } else {
        res.json({ 
          success: false, 
          message: 'ID de candidato no encontrado' 
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint para listar todos los procesamientos activos
  app.get("/api/admin/active-processings", async (req, res) => {
    try {
      const activeProcessings: Array<{candidate_submission_id: string; timestamp: number; elapsed: number}> = [];
      pendingResults.forEach((data, id) => {
        if (data.status === 'processing') {
          activeProcessings.push({
            candidate_submission_id: id,
            timestamp: data.timestamp,
            elapsed: Date.now() - data.timestamp
          });
        }
      });
      
      res.json({ active: activeProcessings });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint para monitorear el estado del rate limiting
  app.get("/api/admin/queue-status", async (req, res) => {
    try {
      const queueStatus = requestQueue.getStatus();
      const rateLimitStatus = ipLimiter.getStatus();
      const apiKeyStats = apiKeyManager.getStats();
      res.json({
        queue: queueStatus,
        rateLimit: rateLimitStatus,
        apiKeys: apiKeyStats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint administrativo para consultar estadísticas de API keys
  app.get("/api/admin/api-keys/stats", async (req, res) => {
    try {
      const stats = apiKeyManager.getStats();
      res.json({
        totalKeys: stats.totalKeys,
        usage: stats.usage,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint para recargar API keys desde variables de entorno
  app.post("/api/admin/api-keys/reload", async (req, res) => {
    try {
      apiKeyManager.reloadKeys();
      const stats = apiKeyManager.getStats();
      res.json({
        success: true,
        message: "API keys reloaded from environment variables",
        totalKeys: stats.totalKeys,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint para limpiar todos los procesamientos (liquidar)
  app.post("/api/liquidate", apiKeyMiddleware, rateLimitMiddleware, async (req, res) => {
    try {
      const beforeCount = pendingResults.size;
      pendingResults.clear();
      
      res.json({ 
        success: true, 
        message: `Sistema liquidado - ${beforeCount} procesamientos eliminados`,
        cleared_count: beforeCount
      });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Proxy endpoint para el webhook de n8n (asíncrono con rate limiting)
  app.post("/api/webhook", apiKeyMiddleware, rateLimitMiddleware, async (req, res) => {
    try {
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      const authToken = process.env.VITE_WEBHOOK_AUTH_TOKEN;

      if (!webhookUrl) {
        return res.status(500).json({
          error: "Configuración del webhook no disponible"
        });
      }

      if (!authToken) {
        return res.status(500).json({
          error: "Token de autorización no configurado"
        });
      }

      // Generar ID único para este candidato
      const candidate_submission_id = `CSI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Registrar procesamiento como "en curso"
      pendingResults.set(candidate_submission_id, {
        status: 'processing',
        timestamp: Date.now()
      });

      // Responder inmediatamente al frontend
      res.json({
        candidate_submission_id,
        status: 'processing',
        message: 'Solicitud recibida, procesando en segundo plano'
      });

      // Preparar datos para n8n
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
      const dataForN8n = {
        ...req.body,
        candidate_submission_id,
        callback_url: `${protocol}://${req.get('host')}/api/webhook-result`
      };

      // Enviar a n8n con rate limiting
      requestQueue.executeWithLimit(async () => {
        return fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(dataForN8n)
        });
      }).catch((error) => {
        pendingResults.set(candidate_submission_id, {
          status: 'error',
          result: { 
            error: 'Error de conexión con el servicio externo',
            details: error.message
          },
          timestamp: Date.now()
        });
      });

    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  });

  // Rutas de debug y testing para iframe protection
  app.get("/api/debug/iframe-status", async (req, res) => {
    const testingMode = process.env.TESTING_MODE === 'true';
    
    if (!testingMode) {
      return res.status(404).json({ error: "Debug endpoint not available" });
    }
    
    const allowedDomains = process.env.ALLOWED_DOMAINS?.split(',').map(d => d.trim()) || [];
    const blockLocalhost = process.env.BLOCK_LOCALHOST === 'true';
    const referer = req.get('Referer') || req.get('Referrer') || '';
    const origin = req.get('Origin') || '';
    const host = req.get('Host') || '';
    
    // Detectar si está en iframe
    const isInIframe = referer !== '';
    
    // Verificar si el dominio está permitido
    let isAllowed = false;
    if (allowedDomains.length > 0) {
      for (const domain of allowedDomains) {
        if (referer.includes(domain) || origin.includes(domain)) {
          isAllowed = true;
          break;
        }
      }
    }
    
    // Verificar localhost
    const isLocalhost = /localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.|file:\/\//.test(host + referer + origin);
    
    res.json({
      isInIframe,
      referer,
      origin,
      host,
      isAllowed,
      allowedDomains,
      blockLocalhost,
      isLocalhost,
      testingMode,
      headers: {
        'user-agent': req.get('User-Agent'),
        'x-forwarded-for': req.get('X-Forwarded-For'),
        'x-real-ip': req.get('X-Real-IP')
      }
    });
  });

  // Endpoint para simular diferentes escenarios de iframe
  app.get("/api/test/simulate-iframe", async (req, res) => {
    const testingMode = process.env.TESTING_MODE === 'true';
    
    if (!testingMode) {
      return res.status(404).json({ error: "Test endpoint not available" });
    }
    
    const { referrer, origin } = req.query;
    const allowedDomains = process.env.ALLOWED_DOMAINS?.split(',').map(d => d.trim()) || [];
    
    // Simular validación con parámetros dados
    let isAllowed = false;
    if (allowedDomains.length > 0 && (referrer || origin)) {
      for (const domain of allowedDomains) {
        if (String(referrer).includes(domain) || String(origin).includes(domain)) {
          isAllowed = true;
          break;
        }
      }
    }
    
    res.json({
      simulation: true,
      referrer: referrer || '',
      origin: origin || '',
      isAllowed,
      allowedDomains,
      wouldBlock: !isAllowed && (referrer || origin),
      message: isAllowed ? 'Domain would be allowed' : 'Domain would be blocked'
    });
  });

  // Serve test iframe page in testing mode
  app.get("/test-iframe", (req, res) => {
    const testingMode = process.env.TESTING_MODE === 'true';
    
    if (!testingMode) {
      return res.status(404).json({ error: "Test page not available" });
    }
    
    const fs = require('fs');
    const path = require('path');
    
    try {
      const testFile = fs.readFileSync(path.join(process.cwd(), 'test-iframe.html'), 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(testFile);
    } catch (error) {
      res.status(500).json({ error: "Test page not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}