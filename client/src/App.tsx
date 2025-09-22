import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import UnauthorizedScreen from "@/components/UnauthorizedScreen";

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

  if (loading) {
    // Mantener comportamiento actual - el componente Home ya tiene su propia pantalla de carga
    return <>{children}</>;
  }

  if (!isValid) {
    return <UnauthorizedScreen error={error} />;
  }

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
