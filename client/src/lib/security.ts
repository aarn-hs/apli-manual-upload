// Configuración de seguridad del cliente
const ALLOWED_DOMAINS = [
  'https://tudominio.com',
  'https://www.tudominio.com',
  'https://app.tudominio.com',
];

// Verificar si la aplicación está siendo ejecutada en un dominio permitido
export function validateDomain(): boolean {
  const currentOrigin = window.location.origin;
  
  // Permitir Replit durante desarrollo
  if (currentOrigin.includes('.replit.') || 
      currentOrigin.includes('.repl.co') ||
      currentOrigin.includes('.replit.app') ||
      currentOrigin.includes('.replit.dev')) {
    return true;
  }
  
  // Bloquear localhost y IPs locales solo en producción
  if (process.env.NODE_ENV === 'production' && 
      (currentOrigin.includes('localhost') || 
       currentOrigin.includes('127.0.0.1') ||
       currentOrigin.includes('0.0.0.0'))) {
    return false;
  }
  
  // Verificar si está en la lista de dominios permitidos
  return ALLOWED_DOMAINS.some(domain => {
    if (domain.includes('*')) {
      const pattern = domain.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(currentOrigin);
    }
    return currentOrigin.startsWith(domain);
  });
}

// Verificar si está siendo usado en iframe no autorizado
export function validateIframeUsage(): boolean {
  try {
    // Si está en iframe, verificar el origen del padre
    if (window !== window.top) {
      const parentOrigin = document.referrer;
      
      if (!parentOrigin) return false;
      
      return ALLOWED_DOMAINS.some(domain => 
        parentOrigin.startsWith(domain)
      );
    }
    return true;
  } catch (e) {
    // Error de acceso cross-origin, potencialmente iframe no autorizado
    return false;
  }
}

// Bloquear herramientas de desarrollo (opcional)
export function preventDevTools(): void {
  // Detectar apertura de DevTools
  let devtools = {
    open: false,
    orientation: null as string | null
  };
  
  const threshold = 160;
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        console.clear();
        console.log('%cAcceso no autorizado detectado', 'color: red; font-size: 20px;');
      }
    } else {
      devtools.open = false;
    }
  }, 500);
  
  // Bloquear clic derecho
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
  
  // Bloquear teclas de desarrollo
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')) {
      e.preventDefault();
      return false;
    }
  });
}