import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Lista de dominios permitidos para iframe (configurable)
const ALLOWED_DOMAINS = [
  'https://tudominio.com',
  'https://www.tudominio.com',
  'https://app.tudominio.com',
  'https://staging.tudominio.com',
  // Dominios de Replit para desarrollo
  'https://*.replit.app',
  'https://*.replit.dev',
  'https://*.repl.co',
  // Agregar más dominios según sea necesario
];

// Función para verificar si un dominio está permitido
function isAllowedDomain(url: string): boolean {
  return ALLOWED_DOMAINS.some((domain: string) => {
    if (domain.includes('*')) {
      // Manejar wildcards como *.replit.app
      const pattern = domain.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(url);
    }
    return url.startsWith(domain);
  });
}

// Middleware de seguridad para bloquear dominios no autorizados
app.use((req, res, next) => {
  const origin = req.get('Origin') || req.get('Referer');
  const host = req.get('Host');
  
  // Para desarrollo en Replit, permitir acceso
  if (process.env.NODE_ENV === 'development' && 
      (host?.includes('.replit.') || origin?.includes('.replit.'))) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    return next();
  }
  
  // En producción, verificar dominios permitidos
  if (process.env.NODE_ENV === 'production') {
    // Bloquear acceso desde localhost o IPs locales
    if (host?.includes('localhost') || 
        host?.includes('127.0.0.1') || 
        host?.includes('0.0.0.0') ||
        origin?.includes('localhost') ||
        origin?.includes('127.0.0.1')) {
      return res.status(403).json({ 
        error: 'Acceso no autorizado desde origen local' 
      });
    }
    
    // Verificar si el origen está en la lista de dominios permitidos
    const isAllowedOrigin = !origin || isAllowedDomain(origin);
    
    if (!isAllowedOrigin && origin) {
      return res.status(403).json({ 
        error: 'Dominio no autorizado para iframe embedding' 
      });
    }
    
    // Configurar cabeceras de seguridad para iframe
    if (isAllowedOrigin && origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.setHeader('X-Frame-Options', `ALLOW-FROM ${origin}`);
      res.setHeader('Content-Security-Policy', `frame-ancestors ${origin}`);
    } else {
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('Content-Security-Policy', 'frame-ancestors \'none\'');
    }
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-XSS-Protection', '1; mode=block');
  
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
