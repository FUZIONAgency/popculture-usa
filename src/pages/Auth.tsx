import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        try {
          // Check if profile exists
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id);

          if (profileError) throw profileError;

          // If no profile exists, create one and treat as new user
          const isNewUser = !profiles || profiles.length === 0;
          
          if (isNewUser) {
            const { error: createError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: session.user.id,
                  email: session.user.email,
                  username: session.user.email?.split('@')[0] // Default username from email
                }
              ]);

            if (createError) throw createError;
            
            // New user - redirect to My Account
            toast.success("Welcome to Pop Culture USA!", {
              description: "Let's set up your account."
            });
            navigate("/my-account");
          } else {
            // Existing user - return to previous page
            toast.success("Welcome back!", {
              description: "You've been successfully logged in."
            });
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
