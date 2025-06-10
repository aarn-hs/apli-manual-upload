import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertCandidateSchema } from "@shared/schema";

// Almacenamiento temporal en memoria para resultados pendientes
const pendingResults = new Map<string, {
  status: 'processing' | 'completed' | 'error';
  result?: any;
  timestamp: number;
}>();

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint de diagnóstico para verificar rutas disponibles
  app.get("/api/health", async (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      endpoints: [
        "POST /api/candidates",
        "POST /api/webhook-result", 
        "GET /api/check-status/:candidate_submission_id",
        "POST /api/liquidate",
        "POST /api/webhook"
      ]
    });
  });

  // API simplificada para validación del formulario
  app.post("/api/candidates", async (req, res) => {
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
      const { candidate_submission_id, status, result, error } = req.body;
      
      if (!candidate_submission_id) {
        return res.status(400).json({ error: "candidate_submission_id requerido" });
      }

      // Actualizar el resultado en memoria
      pendingResults.set(candidate_submission_id, {
        status: status === 'success' ? 'completed' : 'error',
        result: status === 'success' ? result : { error },
        timestamp: Date.now()
      });

      res.json({ success: true, message: "Resultado recibido" });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint para verificar el estado de un procesamiento (polling)
  app.get("/api/check-status/:candidate_submission_id", async (req, res) => {
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

  // Endpoint para limpiar todos los procesamientos (liquidar)
  app.post("/api/liquidate", async (req, res) => {
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
  app.post("/api/webhook", async (req, res) => {
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

      // Enviar a n8n de forma asíncrona
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(dataForN8n)
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
    
    const allowedDomains = process.env.ALLOWED_IFRAME_DOMAINS?.split(',').map(d => d.trim()) || [];
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
    const allowedDomains = process.env.ALLOWED_IFRAME_DOMAINS?.split(',').map(d => d.trim()) || [];
    
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

  const httpServer = createServer(app);
  return httpServer;
}