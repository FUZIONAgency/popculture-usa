import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

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
        {!loading && (
          user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="bg-green-600 hover:bg-green-700 text-white border-none"
                >
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{user.email}</span>
                    <span className="text-sm text-gray-500">User ID: {user.id}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button 
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sign In
              </Button>
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;