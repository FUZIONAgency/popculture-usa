import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

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

  const NavLinks = () => (
    <>
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
    </>
  );

  return (
    <nav className="bg-black w-full py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/">
            <img 
              src="https://kwpptrhywkyuzadwxgdl.supabase.co/storage/v1/object/public/logos/logoPopCulture.png?t=2024-12-14T03%3A54%3A30.233Z" 
              alt="Pop Culture Logo" 
              className="h-12 object-contain cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
          </div>
        </div>

        <div className="flex items-center gap-4">
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
                <DropdownMenuContent className="bg-white border shadow-lg" align="end">
                  <DropdownMenuItem className="hover:bg-gray-100">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{user.email}</span>
                      <span className="text-sm text-gray-500">User ID: {user.id}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="hover:bg-gray-100">
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

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;