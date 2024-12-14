import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black w-full py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <img 
            src="https://kwpptrhywkyuzadwxgdl.supabase.co/storage/v1/object/public/logos/logoPopCulture.png?t=2024-12-14T03%3A54%3A30.233Z" 
            alt="Pop Culture Logo" 
            className="h-12 object-contain"
          />
          <div className="hidden md:flex items-center gap-6">
            <Link to="/tournaments" className="text-white hover:text-primary transition-colors">
              Tournaments
            </Link>
            <Link to="/retailers" className="text-white hover:text-primary transition-colors">
              Retailers
            </Link>
            <Link to="/conventions" className="text-white hover:text-primary transition-colors">
              Conventions
            </Link>
            <Link to="/games" className="text-white hover:text-primary transition-colors">
              Games
            </Link>
          </div>
        </div>
        <Link to="/auth">
          <Button 
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            Sign In
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;