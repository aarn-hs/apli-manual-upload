import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import IframeBlocker from "@/components/IframeBlocker";
import IframeTestingPanel from "@/components/IframeTestingPanel";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IframeBlocker>
        <Router />
        <IframeTestingPanel />
      </IframeBlocker>
    </QueryClientProvider>
  );
}

export default App;
