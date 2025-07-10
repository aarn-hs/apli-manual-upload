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

// Valores por defecto solo para desarrollo en Replit
if (!process.env.TESTING_MODE) {
  process.env.TESTING_MODE = 'true';
}
if (!process.env.ALLOWED_DOMAINS) {
  process.env.ALLOWED_DOMAINS = 'https://a0846e20-5ed9-446b-a265-bdd6d36e57f8-00-31e29bhx9duhu.worf.replit.dev';
}
if (!process.env.BLOCK_LOCALHOST) {
  process.env.BLOCK_LOCALHOST = 'false';
}

// Middleware de protección de dominios simplificado
app.use((req, res, next) => {
  const testingMode = process.env.TESTING_MODE === 'true';
  
  // Headers básicos de CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // En modo testing, permitir todo y configurar headers permisivos
  if (testingMode) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Content-Security-Policy', 'frame-ancestors *');
    return next();
  }
  
  // En producción, aplicar validación de dominios
  const allowedDomains = process.env.ALLOWED_DOMAINS?.split(',').map(d => d.trim()) || [];
  const referer = req.get('Referer') || req.get('Referrer') || '';
  const origin = req.get('Origin') || '';
  
  // Skip para assets y APIs
  const skipPaths = ['/src/', '/@vite/', '/@fs/', '/@react-refresh', '/node_modules/', '/api/', '/.vite/', '/assets/', '/favicon.ico'];
  if (skipPaths.some(path => req.path.startsWith(path))) {
    return next();
  }
  
  // Verificar dominios APLI y Replit para producción
  const apliDomains = ['manual-upload.apli.app', 'demo.apli.app', 'apli.app', 'recruitment.apli.app', 'manual-upload-apli.replit.app'];
  const replitDomains = ['replit.dev', 'replit.app', 'replit.com'];
  
  let isAllowed = !referer && !origin; // Permitir acceso directo
  
  if ((referer || origin) && !isAllowed) {
    const checkUrl = referer || origin;
    isAllowed = allowedDomains.some(domain => checkUrl.includes(domain)) ||
                apliDomains.some(domain => checkUrl.includes(domain)) ||
                replitDomains.some(domain => checkUrl.includes(domain));
  }
  
  if (!isAllowed && (referer || origin) && req.path === '/') {
    return res.status(403).json({ 
      error: 'Server Access Blocked',
      code: 'ACCESS_DENIED'
    });
  }
  
  // Configurar headers de seguridad para producción
  res.setHeader('X-Frame-Options', 'ALLOWED_FROM https://recruitment.apli.app');
  res.setHeader('Content-Security-Policy', `frame-ancestors 'self' ${allowedDomains.join(' ')}`);
  
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
