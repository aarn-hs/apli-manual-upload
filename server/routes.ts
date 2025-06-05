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

      console.log(`[WEBHOOK RESULT] Recibido resultado para ID: ${processing_id}, status: ${status}`);
      
      // Actualizar el resultado en memoria
      pendingResults.set(processing_id, {
        status: status === 'success' ? 'completed' : 'error',
        result: status === 'success' ? result : { error },
        timestamp: Date.now()
      });

      res.json({ success: true, message: "Resultado recibido" });
    } catch (error) {
      console.error('[WEBHOOK RESULT] Error:', error);
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
      console.error('[CHECK STATUS] Error:', error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // Proxy endpoint para el webhook de n8n (ahora asíncrono)
  app.post("/api/webhook", async (req, res) => {
    try {
      console.log('[WEBHOOK ASYNC] Variables de entorno disponibles:', {
        N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL ? 'SET' : 'NOT SET',
        VITE_WEBHOOK_AUTH_TOKEN: process.env.VITE_WEBHOOK_AUTH_TOKEN ? 'SET' : 'NOT SET'
      });
      
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      const authToken = process.env.VITE_WEBHOOK_AUTH_TOKEN;

      if (!webhookUrl) {
        console.log('[WEBHOOK ASYNC] ERROR: N8N_WEBHOOK_URL no está configurada');
        return res.status(500).json({
          error: "N8N_WEBHOOK_URL no configurada en el servidor"
        });
      }

      if (!authToken) {
        console.log('[WEBHOOK ASYNC] ERROR: VITE_WEBHOOK_AUTH_TOKEN no está configurado');
        return res.status(500).json({
          error: "Token de autorización no configurado"
        });
      }

      // Generar ID único para este procesamiento
      const processing_id = `PROC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`[WEBHOOK ASYNC] Generado processing_id: ${processing_id}`);
      
      // Registrar procesamiento como "en curso"
      pendingResults.set(processing_id, {
        status: 'processing',
        timestamp: Date.now()
      });

      // Responder inmediatamente al frontend con el ID de procesamiento
      res.json({
        processing_id,
        status: 'processing',
        message: 'Solicitud recibida, procesando en segundo plano'
      });

      // Procesar en segundo plano sin bloquear la respuesta
      console.log(`[WEBHOOK ASYNC] Enviando a n8n en segundo plano...`);
      
      // Preparar datos para n8n incluyendo el processing_id
      const dataForN8n = {
        ...req.body,
        processing_id, // n8n necesita este ID para enviar la respuesta
        callback_url: `${req.protocol}://${req.get('host')}/api/webhook-result` // URL donde n8n enviará el resultado
      };

      // Enviar a n8n de forma asíncrona (fire and forget)
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(dataForN8n)
      }).catch((error) => {
        console.error(`[WEBHOOK ASYNC] Error enviando a n8n para ID ${processing_id}:`, error.message);
        
        // Solo registrar errores de conexión críticos
        pendingResults.set(processing_id, {
          status: 'error',
          result: { 
            error: 'Error de conexión con el webhook',
            details: error.message
          },
          timestamp: Date.now()
        });
      });

    } catch (error) {
      console.error('[WEBHOOK ASYNC] Error interno:', error);
      res.status(500).json({
        error: 'Error interno del servidor proxy',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}