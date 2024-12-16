import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NavLinks } from "./navbar/NavLinks";
import { UserMenu } from "./navbar/UserMenu";
import { MobileMenu } from "./navbar/MobileMenu";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
              <UserMenu />
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
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;