import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ConventionDetail from "./pages/ConventionDetail";
import Conventions from "./pages/Conventions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Contact from "./pages/Contact";
import MediaKit from "./pages/MediaKit";
import Metrics from "./pages/Metrics";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetail";

const queryClient = new QueryClient();

// Placeholder components for new routes
const Retailers = () => <div>Retailers Page (Coming Soon)</div>;
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
          <Route path="/tournaments/:id" element={<TournamentDetail />} />
          <Route path="/retailers" element={<Retailers />} />
          <Route path="/conventions" element={<Conventions />} />
          <Route path="/conventions/:id" element={<ConventionDetail />} />
          <Route path="/games" element={<Games />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/media-kit" element={<MediaKit />} />
          <Route path="/metrics" element={<Metrics />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;