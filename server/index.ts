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

// Middleware de protección de dominios
app.use((req, res, next) => {
  const allowedDomains = process.env.ALLOWED_DOMAINS?.split(',').map(d => d.trim()) || [];
  const blockLocalhost = process.env.BLOCK_LOCALHOST === 'true';
  const testingMode = process.env.TESTING_MODE === 'true';
  
  // Headers básicos de CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Skip iframe protection for development assets and API endpoints
  const skipPaths = [
    '/src/',
    '/@vite/',
    '/@fs/',
    '/@react-refresh',
    '/node_modules/',
    '/api/',
    '/.vite/',
    '/assets/',
    '/favicon.ico'
  ];
  
  const shouldSkip = skipPaths.some(path => req.path.startsWith(path));
  
  if (shouldSkip) {
    return next();
  }
  
  // Obtener información del request
  const referer = req.get('Referer') || req.get('Referrer') || '';
  const origin = req.get('Origin') || '';
  const userAgent = req.get('User-Agent') || '';
  const host = req.get('Host') || '';
  
  // Log detallado en modo testing (solo para rutas principales)
  if (testingMode && req.path === '/') {
    console.log('🔍 Iframe Protection Check:', {
      path: req.path,
      referer,
      origin,
      host,
      allowedDomains,
      blockLocalhost,
      headers: {
        'x-forwarded-for': req.get('X-Forwarded-For'),
        'x-real-ip': req.get('X-Real-IP')
      }
    });
  }
  
  // Verificar si está siendo accedido desde localhost cuando está bloqueado
  if (blockLocalhost) {
    const isLocalhost = /localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.|file:\/\//.test(host + referer + origin);
    if (isLocalhost && !testingMode) {
      if (testingMode) console.log('❌ Blocked: Localhost access detected');
      return res.status(403).json({ 
        error: 'Access from localhost is not permitted',
        code: 'LOCALHOST_BLOCKED'
      });
    }
  }
  
  // Si hay dominios permitidos configurados
  if (allowedDomains.length > 0) {
    let isAllowed = false;
    
    // Verificar referer y origin contra dominios permitidos
    for (const domain of allowedDomains) {
      if (referer.includes(domain) || origin.includes(domain)) {
        isAllowed = true;
        break;
      }
    }
    
    // Si no está permitido y no es acceso directo (sin referer) y es la ruta principal
    if (!isAllowed && (referer || origin) && req.path === '/') {
      if (testingMode) {
        console.log('❌ Blocked: Domain not in allowed list', { referer, origin, allowedDomains });
      }
      return res.status(403).json({ 
        error: 'Domain not authorized for iframe embedding',
        code: 'DOMAIN_NOT_ALLOWED',
        referer,
        origin,
        allowedDomains: testingMode ? allowedDomains : undefined
      });
    }
    
    // Configurar CSP header con dominios permitidos
    const cspDomains = allowedDomains.join(' ');
    res.setHeader('Content-Security-Policy', `frame-ancestors 'self' ${cspDomains}`);
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    
    if (testingMode && req.path === '/' && !referer && !origin) {
      console.log('✅ Allowed: Direct access (no referer)', { referer, origin });
    }
  } else {
    // Sin dominios configurados, bloquear todos los iframes
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', 'frame-ancestors \'none\'');
  }
  
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
