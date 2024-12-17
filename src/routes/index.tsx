import { Navigate, RouteObject } from "react-router-dom";
import Layout from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Auth from "@/pages/Auth";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import ConventionDetail from "@/pages/ConventionDetail";
import Conventions from "@/pages/Conventions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsConditions from "@/pages/TermsConditions";
import Contact from "@/pages/Contact";
import MediaKit from "@/pages/MediaKit";
import Metrics from "@/pages/Metrics";
import Tournaments from "@/pages/Tournaments";
import TournamentDetail from "@/pages/TournamentDetail";
import TournamentRegistration from "@/pages/TournamentRegistration";
import Retailers from "@/pages/Retailers";
import RetailerDetail from "@/pages/RetailerDetail";
import MyAccount from "@/pages/MyAccount";
import MyTournaments from "@/pages/MyTournaments";
import CreatePlayer from "@/pages/CreatePlayer";
import AddGameAccount from "@/pages/AddGameAccount";
import MyRetailers from "@/pages/MyRetailers";
import Games from "@/pages/Games";
import CreateGame from "@/pages/CreateGame";

const protectedRoute = (element: React.ReactNode) => (
  <Layout>
    <ProtectedRoute>
      {element}
    </ProtectedRoute>
  </Layout>
);

const publicRoute = (element: React.ReactNode) => (
  <Layout>
    {element}
  </Layout>
);

export const routes: RouteObject[] = [
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: publicRoute(<Conventions />),
  },
  {
    path: "/tournaments",
    element: publicRoute(<Tournaments />),
  },
  {
    path: "/tournaments/:id",
    element: publicRoute(<TournamentDetail />),
  },
  {
    path: "/tournaments/:tournamentId/register",
    element: protectedRoute(<TournamentRegistration />),
  },
  {
    path: "/conventions",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/conventions/:id",
    element: publicRoute(<ConventionDetail />),
  },
  {
    path: "/retailers",
    element: publicRoute(<Retailers />),
  },
  {
    path: "/retailers/:id",
    element: publicRoute(<RetailerDetail />),
  },
  {
    path: "/games",
    element: publicRoute(<Games />),
  },
  {
    path: "/create-game",
    element: protectedRoute(<CreateGame />),
  },
  {
    path: "/blog",
    element: publicRoute(<Blog />),
  },
  {
    path: "/blog/:slug",
    element: publicRoute(<BlogPost />),
  },
  {
    path: "/privacy-policy",
    element: publicRoute(<PrivacyPolicy />),
  },
  {
    path: "/terms-conditions",
    element: publicRoute(<TermsConditions />),
  },
  {
    path: "/contact",
    element: publicRoute(<Contact />),
  },
  {
    path: "/media-kit",
    element: publicRoute(<MediaKit />),
  },
  {
    path: "/metrics",
    element: publicRoute(<Metrics />),
  },
  {
    path: "/my-account",
    element: protectedRoute(<MyAccount />),
  },
  {
    path: "/my-retailers",
    element: protectedRoute(<MyRetailers />),
  },
  {
    path: "/create-player",
    element: protectedRoute(<CreatePlayer />),
  },
  {
    path: "/add-game-account",
    element: protectedRoute(<AddGameAccount />),
  },
  {
    path: "/my-tournaments",
    element: protectedRoute(<MyTournaments />),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];