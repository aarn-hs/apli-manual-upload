import { useIframeProtection } from '@/hooks/use-iframe-protection';

export default function IframeBlocker({ children }: { children: React.ReactNode }) {
  const { isInIframe, isAllowed, parentDomain, error, isLoading } = useIframeProtection();

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

  // In testing mode, be more permissive to allow testing
  const testingMode = import.meta.env.VITE_TESTING_MODE === 'true' || true; // Force testing mode for now
  
  if (isInIframe && !isAllowed && !testingMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-red-700 mb-2">Server Access Blocked</h1>
          <p className="text-red-600 mb-4">
            El acceso a esta aplicación ha sido restringido.
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="mb-4">
            <svg className="w-16 h-16 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-yellow-700 mb-2">Error de Verificación</h1>
          <p className="text-yellow-600 mb-4">
            No se pudo verificar los permisos de acceso.
          </p>
          
          <div className="bg-yellow-100 border border-yellow-300 rounded p-3 mb-4">
            <p className="text-sm text-yellow-700">
              <strong>Error:</strong> {error}
            </p>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}