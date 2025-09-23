import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertCandidateSchema } from "@shared/schema";
import rateLimit from "express-rate-limit";

// Almacenamiento temporal en memoria para resultados pendientes
const pendingResults = new Map<string, {
  status: 'queued' | 'processing' | 'completed' | 'error';
  result?: any;
  timestamp: number;
}>();

// Sistema de concurrencia y rate limiting
interface SlotInfo {
  id: string;
  startTime: number;
  timeout: NodeJS.Timeout;
}

class ConcurrencyManager {
  private concurrent = new Map<string, SlotInfo>();
  private queue: string[] = [];
  private readonly maxConcurrent: number;
  private readonly maxQueueSize: number;
  private readonly timeoutMinutes: number;

  constructor() {
    this.maxConcurrent = parseInt(process.env.MAX_CONCURRENT_WEBHOOKS || '7');
    this.maxQueueSize = parseInt(process.env.MAX_QUEUE_SIZE || '50');
    this.timeoutMinutes = parseInt(process.env.WEBHOOK_TIMEOUT_MINUTES || '3');
    console.log(`🔄 ConcurrencyManager initialized: ${this.maxConcurrent} concurrent, ${this.maxQueueSize} queue size`);
  }

  canProcess(): boolean {
    return this.concurrent.size < this.maxConcurrent;
  }

  addToQueue(id: string): boolean {
    if (this.queue.length >= this.maxQueueSize) {
      return false; // Queue lleno
    }
    this.queue.push(id);
    console.log(`📤 Added to queue: ${id} (queue size: ${this.queue.length})`);
    return true;
  }

  addToConcurrent(id: string): void {
    const timeout = setTimeout(() => {
      console.warn(`⏰ Timeout reached for ${id}, releasing slot`);
      this.onTimeout(id);
    }, this.timeoutMinutes * 60 * 1000);

    this.concurrent.set(id, {
      id,
      startTime: Date.now(),
      timeout
    });
    
    console.log(`🚀 Started processing: ${id} (${this.concurrent.size}/${this.maxConcurrent} slots used)`);
  }

  onWebhookResponse(id: string): void {
    const slot = this.concurrent.get(id);
    if (slot) {
      clearTimeout(slot.timeout);
      this.concurrent.delete(id);
      console.log(`✅ Webhook response for ${id}, slot released (${this.concurrent.size}/${this.maxConcurrent} slots used)`);
      this.processNext();
    }
  }

  onTimeout(id: string): void {
    const slot = this.concurrent.get(id);
    if (slot) {
      clearTimeout(slot.timeout);
      this.concurrent.delete(id);
      
      // Marcar como error por timeout
      pendingResults.set(id, {
        status: 'error',
        result: { error: 'El proceso tardó más de 3 minutos' },
        timestamp: Date.now()
      });
      
      console.log(`⏰ Timeout for ${id}, marked as error and slot released`);
      this.processNext();
    }
  }

  processNext(): void {
    if (this.queue.length > 0 && this.canProcess()) {
      const nextId = this.queue.shift()!;
      console.log(`📋 Processing next from queue: ${nextId} (queue size: ${this.queue.length})`);
      
      // Cambiar estado de queued a processing
      const pending = pendingResults.get(nextId);
      if (pending) {
        pendingResults.set(nextId, {
          ...pending,
          status: 'processing'
        });
      }
      
      // Agregar a concurrent y enviar webhook
      this.addToConcurrent(nextId);
      this.sendWebhookRequest(nextId);
    }
  }

  async sendWebhookRequest(candidateSubmissionId: string): Promise<void> {
    try {
      const pending = pendingResults.get(candidateSubmissionId);
      if (!pending || !pending.result?.webhookData) {
        console.error(`No webhook data found for ${candidateSubmissionId}`);
        return;
      }

      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      const authToken = process.env.VITE_WEBHOOK_AUTH_TOKEN;
      
      if (!webhookUrl) {
        throw new Error('N8N_WEBHOOK_URL no configurada');
      }
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      console.log(`🌐 Sending webhook for ${candidateSubmissionId} to ${webhookUrl}`);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(pending.result.webhookData)
      });
      
      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }
      
      console.log(`✅ Webhook sent successfully for ${candidateSubmissionId}`);
      
    } catch (error) {
      console.error(`❌ Error sending webhook for ${candidateSubmissionId}:`, error);
      
      // Marcar como error y liberar slot
      pendingResults.set(candidateSubmissionId, {
        status: 'error',
        result: { error: 'Error al conectar con el servicio de procesamiento' },
        timestamp: Date.now()
      });
      
      this.onWebhookResponse(candidateSubmissionId); // Liberar slot
    }
  }

  getStats() {
    return {
      concurrent: this.concurrent.size,
      maxConcurrent: this.maxConcurrent,
      queueSize: this.queue.length,
      maxQueueSize: this.maxQueueSize,
      concurrentIds: Array.from(this.concurrent.keys()),
      queuedIds: [...this.queue]
    };
  }
}

const concurrencyManager = new ConcurrencyManager();

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
    // Sanitize usage data to never expose actual API keys
    const sanitizedUsage: Record<string, { count: number; lastUsed: number }> = {};
    
    let keyIndex = 1;
    this.keyUsage.forEach((usage, apiKey) => {
      // Use a hash or safe identifier instead of the actual API key
      const safeKeyId = `key_${keyIndex}`;
      sanitizedUsage[safeKeyId] = usage;
      keyIndex++;
    });

    return {
      totalKeys: this.validKeys.size,
      usage: sanitizedUsage
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

// Rate limiting middlewares
const webhookRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: parseInt(process.env.RATE_LIMIT_WEBHOOK_PER_MIN || '3'),
  message: {
    error: 'Rate limit exceeded',
    message: 'Has enviado muchas solicitudes, espera un momento'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const pollingRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto  
  max: parseInt(process.env.RATE_LIMIT_POLLING_PER_MIN || '50'),
  message: {
    error: 'Rate limit exceeded',
    message: 'Demasiadas consultas de estado, espera un momento'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Simplified iframe status endpoint - always allows access
  app.get("/api/debug/iframe-status", async (req, res) => {
    try {
      const referer = req.get('Referer') || '';
      const origin = req.get('Origin') || '';
      const host = req.get('Host') || '';
      
      // Always allow iframe embedding from any domain
      const isInIframe = referer && referer !== `${req.protocol}://${host}${req.originalUrl}`;
      
      res.json({
        isInIframe,
        referer,
        origin,
        host,
        isAllowed: true, // Always allow
        allowedDomains: ['*'], // Allow all domains
        testingMode: true
      });
    } catch (error) {
      res.status(500).json({ error: "Error checking iframe status" });
    }
  });

  // Endpoint de diagnóstico para verificar rutas disponibles (sin rate limit)
  app.get("/api/health", async (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      endpoints: [
        "POST /api/candidates (Auth Required)",
        "POST /api/webhook-result", 
        "GET /api/check-status/:candidate_submission_id (Auth + Polling Rate Limit)",
        "POST /api/liquidate (Auth Required)",
        "POST /api/webhook (Auth + Webhook Rate Limit + Concurrency Queue)",
        "GET /api/admin/active-processings",
        "GET /api/admin/queue-status",
        "GET /api/admin/api-keys/stats",
        "POST /api/admin/api-keys/reload"
      ],
      rateLimiting: {
        webhook: `${process.env.RATE_LIMIT_WEBHOOK_PER_MIN || '3'} requests/min`,
        polling: `${process.env.RATE_LIMIT_POLLING_PER_MIN || '50'} requests/min`
      },
      concurrency: {
        maxConcurrent: parseInt(process.env.MAX_CONCURRENT_N8N_REQUESTS || '7'),
        maxQueueSize: parseInt(process.env.MAX_QUEUE_SIZE || '50'),
        timeout: `${parseInt(process.env.WEBHOOK_TIMEOUT_MS || '180000')}ms`
      }
    });
  });

  // API simplificada para validación del formulario
  app.post("/api/candidates", apiKeyMiddleware, async (req, res) => {
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

      // CRÍTICO: Liberar slot y procesar siguiente del queue
      concurrencyManager.onWebhookResponse(candidate_submission_id);

      res.json({ success: true, message: "Resultado recibido" });
    } catch (error) {
      console.error('Error in webhook-result endpoint:', error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint para verificar el estado de un procesamiento (polling)
  app.get("/api/check-status/:candidate_submission_id", pollingRateLimit, apiKeyMiddleware, async (req, res) => {
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

  // Endpoint para monitorear el estado del sistema
  app.get("/api/admin/queue-status", async (req, res) => {
    try {
      const apiKeyStats = apiKeyManager.getStats();
      const concurrencyStats = concurrencyManager.getStats();
      
      res.json({
        concurrency: {
          currentConcurrent: concurrencyStats.concurrent,
          maxConcurrent: concurrencyStats.maxConcurrent,
          queueSize: concurrencyStats.queueSize,
          maxQueueSize: concurrencyStats.maxQueueSize,
          concurrentIds: concurrencyStats.concurrentIds,
          queuedIds: concurrencyStats.queuedIds
        },
        rateLimit: {
          webhookLimit: parseInt(process.env.RATE_LIMIT_WEBHOOK_PER_MIN || '3'),
          pollingLimit: parseInt(process.env.RATE_LIMIT_POLLING_PER_MIN || '50'),
          status: "active"
        },
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
  app.post("/api/liquidate", apiKeyMiddleware, async (req, res) => {
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

  // Proxy endpoint para el webhook de n8n (asíncrono)
  app.post("/api/webhook", webhookRateLimit, apiKeyMiddleware, async (req, res) => {
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
      
      // Preparar datos para n8n
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
      const dataForN8n = {
        ...req.body,
        candidate_submission_id,
        callback_url: `${protocol}://${req.get('host')}/api/webhook-result`
      };

      // Verificar si se puede procesar inmediatamente o debe ir al queue
      if (concurrencyManager.canProcess()) {
        // Procesar inmediatamente
        pendingResults.set(candidate_submission_id, {
          status: 'processing',
          result: { webhookData: dataForN8n },
          timestamp: Date.now()
        });

        concurrencyManager.addToConcurrent(candidate_submission_id);
        
        // Responder al frontend
        res.json({
          candidate_submission_id,
          status: 'processing',
          message: 'Solicitud recibida, procesando'
        });

        // Procesar inmediatamente sin bloquear la respuesta
        setTimeout(() => {
          concurrencyManager.sendWebhookRequest(candidate_submission_id);
        }, 100);

      } else {
        // Agregar al queue
        const queueSuccess = concurrencyManager.addToQueue(candidate_submission_id);
        
        if (!queueSuccess) {
          return res.status(429).json({
            error: 'Queue full',
            message: 'Muchas solicitudes en proceso, intenta en 1 minuto'
          });
        }

        // Registrar en queue
        pendingResults.set(candidate_submission_id, {
          status: 'queued',
          result: { webhookData: dataForN8n },
          timestamp: Date.now()
        });

        // Responder al frontend
        res.json({
          candidate_submission_id,
          status: 'queued',
          message: 'Solicitud recibida, en cola de procesamiento'
        });
      }

    } catch (error) {
      console.error('Error in webhook endpoint:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  });

  // Debug endpoints removed - iframe embedding allowed from any domain

  const httpServer = createServer(app);
  return httpServer;
}