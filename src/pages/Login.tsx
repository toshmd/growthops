import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErrorBoundary from "@/components/advisor/ErrorBoundary";
import { sanitizeInput } from "@/utils/sanitization";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthChange = async (event: string, session: any) => {
      console.log("Auth state changed:", event, session);
      
      // Sanitize any user input before displaying in toast messages
      const sanitizedEvent = sanitizeInput(event);
      
      if (event === 'SIGNED_IN' && session) {
        // Store the UTC timestamp of the login
        const loginTime = new Date().toISOString();
        console.log("User signed in at (UTC):", loginTime);
        
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
        navigate("/");
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
      } else if (event === 'USER_DELETED') {
        toast({
          variant: "destructive",
          title: "Account Deleted",
          description: "Your account has been deleted",
        });
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password Recovery",
          description: "Check your email for password reset instructions",
        });
      }
    };

    // Check existing session with error handling
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          throw error;
        }
        
        if (session) {
          console.log("Existing session found at (UTC):", new Date().toISOString());
          navigate("/");
        }
      } catch (error: any) {
        console.error("Session check error:", error);
        setAuthError(sanitizeInput(error.message));
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check login status. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Initial session check
    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // Loading state with fallback UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Error boundary fallback component
  const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>{sanitizeInput(error.message)}</AlertDescription>
      </Alert>
    </div>
  );

  const LoginContent = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
          <p className="text-center text-muted-foreground mt-2">
            Please sign in to continue to your dashboard
          </p>
          {authError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
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
        />
      </Card>
    </div>
  );

  return (
    <ErrorBoundary fallback={<ErrorFallback error={new Error(authError || 'Unknown error')} resetErrorBoundary={() => setAuthError(null)} />}>
      <LoginContent />
    </ErrorBoundary>
  );
};

export default Login;