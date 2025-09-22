import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import UnauthorizedScreen from "@/components/UnauthorizedScreen";
import LoadingScreen from "@/components/LoadingScreen";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isValid, loading, error } = useTokenValidation();

  // CRÍTICO: Mostrar pantalla de carga completa durante validación
  // No renderizar contenido hasta que la validación esté completamente terminada
  if (loading) {
    return <LoadingScreen />;
  }

  // Solo mostrar contenido no autorizado cuando validación está completa
  if (!isValid) {
    return <UnauthorizedScreen error={error} />;
  }

  // Solo renderizar contenido de la app cuando token es completamente válido
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <Router />
      </AuthGuard>
    </QueryClientProvider>
  );
}

export default App;
