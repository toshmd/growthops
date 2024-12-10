import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import ErrorBoundary from "@/components/advisor/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeInput } from "@/utils/sanitization";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import { ErrorFallback } from "@/components/auth/ErrorFallback";

const Login = () => {
  const navigate = useNavigate();
  const { toast, dismiss } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const authChangeInProgress = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      dismiss();
    };
  }, [dismiss]);

  useEffect(() => {
    const handleAuthChange = async (event: string, session: any) => {
      if (!isMounted.current || authChangeInProgress.current) return;

      try {
        authChangeInProgress.current = true;
        console.log("Auth state changed:", event, session);
        
        const sanitizedEvent = sanitizeInput(event);
        
        if (event === 'SIGNED_IN' && session) {
          const loginTime = new Date().toISOString();
          console.log("User signed in at (UTC):", loginTime);
          
          const { data: { user }, error: sessionError } = await supabase.auth.getUser();
          if (sessionError || !user) {
            throw new Error('Invalid session');
          }
          
          if (isMounted.current) {
            toast({
              title: "Welcome back!",
              description: "You have been successfully signed in.",
            });
            navigate("/");
          }
        } else if (event === 'SIGNED_OUT' && isMounted.current) {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully",
          });
        } else if (event === 'PASSWORD_RECOVERY' && isMounted.current) {
          toast({
            title: "Password Recovery",
            description: "Check your email for password reset instructions",
          });
        }
      } catch (error) {
        console.error("Auth change error:", error);
        if (isMounted.current) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred during authentication",
          });
        }
      } finally {
        authChangeInProgress.current = false;
      }
    };

    let isCheckingSession = false;
    const checkSession = async () => {
      if (isCheckingSession) return;
      
      try {
        isCheckingSession = true;
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          throw error;
        }
        
        if (session && isMounted.current) {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            throw new Error('Invalid session');
          }
          
          console.log("Existing session found at (UTC):", new Date().toISOString());
          navigate("/");
        }
      } catch (error: any) {
        console.error("Session check error:", error);
        if (isMounted.current) {
          setAuthError(sanitizeInput(error.message));
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to check login status. Please try again.",
          });
        }
      } finally {
        isCheckingSession = false;
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const LoginContent = () => (
    <div 
      className="min-h-screen flex items-center justify-center bg-background"
      role="main"
    >
      <div className="w-full max-w-md">
        <LoginHeader authError={authError} />
        <LoginForm />
      </div>
    </div>
  );

  return (
    <ErrorBoundary 
      fallback={
        <ErrorFallback 
          error={new Error(authError || 'Unknown error')} 
          resetErrorBoundary={() => setAuthError(null)} 
        />
      }
    >
      <LoginContent />
    </ErrorBoundary>
  );
};

export default Login;