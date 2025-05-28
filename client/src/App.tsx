import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { validateDomain, validateIframeUsage, preventDevTools } from "./lib/security";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    // Validar dominio y uso de iframe
    const domainValid = validateDomain();
    const iframeValid = validateIframeUsage();
    
    if (!domainValid || !iframeValid) {
      setIsAuthorized(false);
      // Mostrar mensaje de acceso no autorizado
      return;
    }
    
    setIsAuthorized(true);
    
    // Activar protecciones de desarrollo (opcional)
    // preventDevTools();
  }, []);
  
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso No Autorizado</h1>
          <p className="text-gray-600 mb-4">
            Esta aplicación solo puede ser utilizada desde dominios autorizados.
          </p>
          <p className="text-sm text-gray-500">
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
