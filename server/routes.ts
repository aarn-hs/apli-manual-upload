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
        "GET /api/check-status/:processing_id",
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
      const { processing_id, status, result, error } = req.body;
      
      if (!processing_id) {
        return res.status(400).json({ error: "processing_id requerido" });
      }

      // Actualizar el resultado en memoria
      pendingResults.set(processing_id, {
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
  app.get("/api/check-status/:processing_id", async (req, res) => {
    try {
      const { processing_id } = req.params;
      const result = pendingResults.get(processing_id);
      
      if (!result) {
        return res.json({ 
          status: 'not_found',
          message: 'ID de procesamiento no encontrado o expirado'
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
  app.delete("/api/cancel-processing/:processing_id", async (req, res) => {
    try {
      const { processing_id } = req.params;
      
      if (pendingResults.has(processing_id)) {
        pendingResults.set(processing_id, {
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
          message: 'ID de procesamiento no encontrado' 
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Endpoint para listar todos los procesamientos activos
  app.get("/api/admin/active-processings", async (req, res) => {
    try {
      const activeProcessings = [];
      pendingResults.forEach((data, id) => {
        if (data.status === 'processing') {
          activeProcessings.push({
            processing_id: id,
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

      // Generar ID único para este procesamiento
      const processing_id = `PROC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Registrar procesamiento como "en curso"
      pendingResults.set(processing_id, {
        status: 'processing',
        timestamp: Date.now()
      });

      // Responder inmediatamente al frontend
      res.json({
        processing_id,
        status: 'processing',
        message: 'Solicitud recibida, procesando en segundo plano'
      });

      // Preparar datos para n8n
      const dataForN8n = {
        ...req.body,
        processing_id,
        callback_url: `${req.protocol}://${req.get('host')}/api/webhook-result`
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
        pendingResults.set(processing_id, {
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

  const httpServer = createServer(app);
  return httpServer;
}