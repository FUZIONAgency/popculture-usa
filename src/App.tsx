import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import MyAccount from '@/pages/MyAccount';
import AddGameAccount from '@/pages/AddGameAccount';
import CreatePlayer from '@/pages/CreatePlayer';
import Tournaments from '@/pages/Tournaments';
import TournamentDetails from '@/pages/TournamentDetails';
import Retailers from '@/pages/Retailers';
import RetailerDetails from '@/pages/RetailerDetails';
import Conventions from '@/pages/Conventions';
import ConventionDetails from '@/pages/ConventionDetails';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Contact from '@/pages/Contact';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/auth" element={<Layout><Auth /></Layout>} />
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
            path="/create-player" 
            element={
              <Layout>
                <ProtectedRoute>
                  <CreatePlayer />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route path="/tournaments" element={<Layout><Tournaments /></Layout>} />
          <Route path="/tournaments/:id" element={<Layout><TournamentDetails /></Layout>} />
          <Route path="/retailers" element={<Layout><Retailers /></Layout>} />
          <Route path="/retailers/:id" element={<Layout><RetailerDetails /></Layout>} />
          <Route path="/conventions" element={<Layout><Conventions /></Layout>} />
          <Route path="/conventions/:id" element={<Layout><ConventionDetails /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;