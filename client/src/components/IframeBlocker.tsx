import { useIframeProtection } from '@/hooks/use-iframe-protection';
import { useEffect } from 'react';

export default function IframeBlocker({ children }: { children: React.ReactNode }) {
  const { isInIframe, isAllowed, parentDomain, error, isLoading } = useIframeProtection();

  // Aplicar clases CSS para iframe
  useEffect(() => {
    if (isInIframe && isAllowed) {
      document.body.classList.add('iframe-mode');
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.classList.add('iframe-container');
      }
    } else {
      document.body.classList.remove('iframe-mode');
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.classList.remove('iframe-container');
      }
    }

    return () => {
      document.body.classList.remove('iframe-mode');
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.classList.remove('iframe-container');
      }
    };
  }, [isInIframe, isAllowed]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos de acceso...</p>
        </div>
      </div>
    );
  }

  // Permitir acceso en desarrollo y dominios autorizados
  const isDevelopment = window.location.hostname.includes('localhost') || 
                       window.location.hostname.includes('127.0.0.1') ||
                       window.location.hostname.includes('replit.dev') || 
                       window.location.hostname.includes('replit.app');

  // Solo bloquear si está en iframe, no está permitido, y no es desarrollo
  if (isInIframe && !isAllowed && !isDevelopment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-red-700 mb-2">Acceso Restringido</h1>
          <p className="text-red-600 mb-4">
            Este formulario solo puede ser accedido desde dominios autorizados.
          </p>
          
          <p className="text-sm text-gray-600">
            Si necesita acceso, contacte al administrador del sistema.
          </p>
          
          <button
            onClick={() => window.top?.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}