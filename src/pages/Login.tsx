import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (session) {
        navigate("/");
      }
    });

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Checking existing session:", session);
      if (session) {
        navigate("/");
      }
    }).catch(error => {
      console.error("Session check error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check login status. Please try again.",
      });
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
          <p className="text-center text-muted-foreground mt-2">
            Please sign in to continue to your dashboard
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary))',
                }
              }
            },
            className: {
              container: 'flex flex-col gap-4',
              button: 'bg-primary text-primary-foreground hover:bg-primary/90',
              input: 'bg-background',
              message: 'text-destructive text-sm',
            }
          }}
          providers={[]}
          onError={(error) => {
            console.error("Auth error:", error);
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: error.message || "Failed to sign in. Please check your credentials and try again.",
            });
          }}
        />
      </Card>
    </div>
  );
};

export default Login;