import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de protección de dominios mediante variables de entorno
// Configura estas variables en la sección "Secrets" de Replit:
// TESTING_MODE=false (para producción)
// ALLOWED_DOMAINS=https://tudominio.com,https://app.tudominio.com
// BLOCK_LOCALHOST=true (para producción)

// Configuración temporal para pruebas de iframe - PERMITIR TODO
// NOTA: Esto es temporal para pruebas con VDI del cliente
process.env.TESTING_MODE = 'true';
process.env.ALLOWED_DOMAINS = '*';
process.env.BLOCK_LOCALHOST = 'false';

// Middleware de protección de dominios simplificado
app.use((req, res, next) => {
  const testingMode = process.env.TESTING_MODE === 'true';
  
  // Headers básicos de CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // En modo testing, permitir TODO - headers ultra permisivos para iframe
  if (testingMode) {
    res.removeHeader('X-Frame-Options'); // Remover completamente para evitar conflictos
    res.setHeader('Content-Security-Policy', 'frame-ancestors *'); // Permitir cualquier parent
    res.setHeader('X-Content-Type-Options', 'nosniff'); // Mantener seguridad básica
    return next();
  }
  
  // MODO PRODUCCIÓN TEMPORALMENTE DESACTIVADO PARA PRUEBAS DE VDI
  // Permitir todos los orígenes y referencias temporalmente
  
  // Skip para assets y APIs (mantener optimización)
  const skipPaths = ['/src/', '/@vite/', '/@fs/', '/@react-refresh', '/node_modules/', '/api/', '/.vite/', '/assets/', '/favicon.ico'];
  if (skipPaths.some(path => req.path.startsWith(path))) {
    return next();
  }
  
  // TEMPORAL: Permitir TODO para pruebas de iframe en VDI
  // Configurar headers ultra permisivos
  res.removeHeader('X-Frame-Options'); // No establecer restricciones de frame
  res.setHeader('Content-Security-Policy', 'frame-ancestors *'); // Permitir cualquier parent
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);



  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
