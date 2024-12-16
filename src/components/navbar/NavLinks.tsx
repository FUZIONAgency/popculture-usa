import { Link } from "react-router-dom";

export const NavLinks = () => (
  <>
    <Link to="/tournaments" className="text-white hover:text-red-500 transition-colors">
      Tournaments
    </Link>
    <Link to="/retailers" className="text-white hover:text-red-500 transition-colors">
      Retailers
    </Link>
    <Link to="/conventions" className="text-white hover:text-red-500 transition-colors">
      Conventions
    </Link>
    <Link to="/games" className="text-white hover:text-red-500 transition-colors">
      Games
    </Link>
    <Link to="/blog" className="text-white hover:text-red-500 transition-colors">
      Blog
    </Link>
  </>
);