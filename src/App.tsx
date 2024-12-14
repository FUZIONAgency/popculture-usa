import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ConventionDetail from "./pages/ConventionDetail";

const queryClient = new QueryClient();

// Placeholder components for new routes
const Tournaments = () => <div>Tournaments Page (Coming Soon)</div>;
const Retailers = () => <div>Retailers Page (Coming Soon)</div>;
const Conventions = () => <div>Conventions Page (Coming Soon)</div>;
const Games = () => <div>Games Page (Coming Soon)</div>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Index />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/retailers" element={<Retailers />} />
          <Route path="/conventions" element={<Conventions />} />
          <Route path="/conventions/:id" element={<ConventionDetail />} />
          <Route path="/games" element={<Games />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;