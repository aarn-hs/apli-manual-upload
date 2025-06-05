import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertCandidateSchema } from "@shared/schema";

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

  // Proxy endpoint para el webhook de n8n
  app.post("/api/webhook", async (req, res) => {
    try {
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      const authToken = process.env.VITE_WEBHOOK_AUTH_TOKEN;

      if (!webhookUrl) {
        return res.status(500).json({
          error: "N8N_WEBHOOK_URL no configurada en el servidor"
        });
      }

      if (!authToken) {
        return res.status(500).json({
          error: "Token de autorización no configurado"
        });
      }

      console.log(`[WEBHOOK PROXY] Reenviando petición a n8n...`);
      
      // Configurar timeout de 5 minutos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutos

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(req.body),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const responseData = await response.text();
        
        console.log(`[WEBHOOK PROXY] Respuesta recibida: ${response.status}`);

        // Reenviar respuesta al frontend
        res.status(response.status);
        
        // Configurar headers CORS para el frontend
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Intentar parsear como JSON, si falla enviar como texto
        try {
          const jsonData = JSON.parse(responseData);
          res.json(jsonData);
        } catch {
          res.send(responseData);
        }

      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.log('[WEBHOOK PROXY] Timeout después de 5 minutos');
          return res.status(408).json({
            error: 'TIMEOUT: El webhook tardó más de 5 minutos en responder'
          });
        }

        console.error('[WEBHOOK PROXY] Error al conectar con n8n:', fetchError.message);
        return res.status(502).json({
          error: 'Error de conexión con el webhook externo',
          details: fetchError.message
        });
      }

    } catch (error) {
      console.error('[WEBHOOK PROXY] Error interno:', error);
      res.status(500).json({
        error: 'Error interno del servidor proxy',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}