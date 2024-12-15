import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "./contexts/PlayerContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ConventionDetail from "./pages/ConventionDetail";
import Conventions from "./pages/Conventions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Contact from "./pages/Contact";
import MediaKit from "./pages/MediaKit";
import Metrics from "./pages/Metrics";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetail";
import Retailers from "./pages/Retailers";
import RetailerDetail from "./pages/RetailerDetail";
import MyAccount from "./pages/MyAccount";
import MyTournaments from "./pages/MyTournaments";
import CreatePlayer from "./pages/CreatePlayer";
import AddGameAccount from "./pages/AddGameAccount";

const queryClient = new QueryClient();

// Placeholder components for new routes
const Games = () => <div>Games Page (Coming Soon)</div>;

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PlayerProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/tournaments" element={<Layout><Tournaments /></Layout>} />
            <Route path="/tournaments/:id" element={<Layout><TournamentDetail /></Layout>} />
            <Route path="/conventions" element={<Layout><Conventions /></Layout>} />
            <Route path="/conventions/:id" element={<Layout><ConventionDetail /></Layout>} />
            <Route path="/retailers" element={<Layout><Retailers /></Layout>} />
            <Route path="/retailers/:id" element={<Layout><RetailerDetail /></Layout>} />
            <Route path="/games" element={<Layout><Games /></Layout>} />
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
            <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
            <Route path="/terms-conditions" element={<Layout><TermsConditions /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/media-kit" element={<Layout><MediaKit /></Layout>} />
            <Route path="/metrics" element={<Layout><Metrics /></Layout>} />
            <Route 
              path="/my-account" 
              element={
                <Layout>
                  <ProtectedRoute>
                    <MyAccount />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            <Route 
              path="/create-player" 
              element={
                <Layout>
                  <ProtectedRoute>
                    <CreatePlayer />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            <Route 
              path="/add-game-account" 
              element={
                <Layout>
                  <ProtectedRoute>
                    <AddGameAccount />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            <Route 
              path="/my-tournaments" 
              element={
                <Layout>
                  <ProtectedRoute>
                    <MyTournaments />
                  </ProtectedRoute>
                </Layout>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PlayerProvider>
  </QueryClientProvider>
);

export default App;