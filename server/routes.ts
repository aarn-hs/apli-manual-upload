import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertCandidateSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy para webhook para evitar problemas de CORS
  app.post("/api/webhook-proxy", async (req, res) => {
    try {
      const { webhookUrl, data } = req.body;
      
      if (!webhookUrl || !data) {
        return res.status(400).json({ 
          error: "webhookUrl y data son requeridos" 
        });
      }

      console.log('Enviando datos al webhook desde el servidor:', data);
      console.log('URL del webhook:', webhookUrl);

      // Hacer la petición al webhook desde el servidor
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 300000); // 5 minutos timeout

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal
      }).catch((fetchError) => {
        clearTimeout(timeoutId);
        console.error('Error en el servidor al hacer fetch al webhook:', fetchError);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('TIMEOUT: El webhook tardó más de 5 minutos en responder.');
        }
        
        throw new Error('NETWORK_ERROR: No se pudo establecer conexión con el webhook.');
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Respuesta de error del webhook:', response.status, errorText);
        return res.status(response.status).json({
          error: 'Error del webhook',
          status: response.status,
          message: errorText
        });
      }

      // Intentar parsear la respuesta como JSON
      let responseData;
      try {
        const responseText = await response.text();
        console.log('Respuesta del webhook (texto):', responseText);
        
        if (responseText.trim()) {
          responseData = JSON.parse(responseText);
        } else {
          responseData = { message: 'Respuesta vacía del webhook' };
        }
      } catch (parseError) {
        console.error('Error al parsear respuesta del webhook:', parseError);
        responseData = { message: 'Respuesta no válida del webhook' };
      }

      console.log('Datos de respuesta del webhook:', responseData);
      
      // Enviar la respuesta del webhook al frontend
      res.json(responseData);

    } catch (error) {
      console.error('Error en webhook proxy:', error);
      res.status(500).json({ 
        error: "Error interno del servidor", 
        details: error instanceof Error ? error.message : "Error desconocido"
      });
    }
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

  const httpServer = createServer(app);
  return httpServer;
}