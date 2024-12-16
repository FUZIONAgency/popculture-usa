import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import type { Player } from "@/types/player";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const storePlayerData = async (email: string) => {
    try {
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('*')
        .eq('email', email)
        .single();

      if (playerError && playerError.code !== 'PGRST116') {
        throw playerError;
      }

      if (playerData) {
        // Store player data in localStorage
        localStorage.setItem('currentPlayer', JSON.stringify(playerData));
        console.log('Player data stored:', playerData);
      }

      return playerData;
    } catch (error) {
      console.error('Error fetching player data:', error);
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        try {
          // Check if profile exists
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            toast.error("Error checking profile", {
              description: profileError.message
            });
            return;
          }

          // If no profile exists, create one and treat as new user
          if (!profiles) {
            const { error: createError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: session.user.id,
                  email: session.user.email,
                  username: session.user.email?.split('@')[0] // Default username from email
                }
              ]);

            if (createError) {
              toast.error("Error creating profile", {
                description: createError.message
              });
              return;
            }
            
            // New user - redirect to My Account
            toast.success("Welcome to Pop Culture USA!", {
              description: "Let's set up your account."
            });
            navigate("/my-account");
          } else {
            // Check and store player data if email exists
            if (session.user.email) {
              const playerData = await storePlayerData(session.user.email);
              
              // Existing user - return to previous page
              toast.success("Welcome back!", {
                description: playerData ? "Player data loaded successfully." : "You've been successfully logged in."
              });
            }
            navigate(from);
          }
        } catch (error: any) {
          console.error('Error handling auth:', error);
          toast.error("Authentication Error", {
            description: error.message
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, from]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Pop Culture USA</h1>
          <p className="text-muted-foreground">Sign in to access exclusive content</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#6366f1',
                    brandAccent: '#4f46e5',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
