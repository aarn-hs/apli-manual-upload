// Configuración de seguridad centralizada
module.exports = {
  // Dominios permitidos para iframe embedding
  allowedDomains: [
    'https://tudominio.com',
    'https://www.tudominio.com',
    'https://app.tudominio.com',
    'https://staging.tudominio.com',
    // Agregar más dominios según sea necesario
  ],
  
  // Configuración de bloqueo local
  blockLocalhost: true,
  blockLocalIPs: true,
  
  // Configuración de protecciones adicionales
  enableDevToolsBlocking: false,
  enableRightClickBlocking: false,
  
  // Configuración de CORS
  corsOptions: {
    credentials: true,
    optionsSuccessStatus: 200
  }
};