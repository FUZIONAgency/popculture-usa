import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import Conventions from "@/pages/Conventions";
import ConventionDetail from "@/pages/ConventionDetail";
import MediaKit from "@/pages/MediaKit";
import Metrics from "@/pages/Metrics";
import MyAccount from "@/pages/MyAccount";
import MyRetailers from "@/pages/MyRetailers";
import MyTournaments from "@/pages/MyTournaments";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import RetailerDetail from "@/pages/RetailerDetail";
import Retailers from "@/pages/Retailers";
import TermsConditions from "@/pages/TermsConditions";
import TournamentDetail from "@/pages/TournamentDetail";
import TournamentRegistration from "@/pages/TournamentRegistration";
import Tournaments from "@/pages/Tournaments";
import CreatePlayer from "@/pages/CreatePlayer";
import AddGameAccount from "@/pages/AddGameAccount";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/conventions" element={<Conventions />} />
              <Route path="/conventions/:id" element={<ConventionDetail />} />
              <Route path="/media-kit" element={<MediaKit />} />
              <Route path="/metrics" element={<Metrics />} />
              <Route
                path="/my-account"
                element={
                  <ProtectedRoute>
                    <MyAccount />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-retailers"
                element={
                  <ProtectedRoute>
                    <MyRetailers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-tournaments"
                element={
                  <ProtectedRoute>
                    <MyTournaments />
                  </ProtectedRoute>
                }
              />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/retailers" element={<Retailers />} />
              <Route path="/retailers/:id" element={<RetailerDetail />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/tournaments/:id" element={<TournamentDetail />} />
              <Route
                path="/tournaments/:id/register"
                element={<TournamentRegistration />}
              />
              <Route
                path="/create-player"
                element={
                  <ProtectedRoute>
                    <CreatePlayer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-game-account"
                element={
                  <ProtectedRoute>
                    <AddGameAccount />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" richColors />
      </Router>
    </QueryClientProvider>
  );
}

export default App;