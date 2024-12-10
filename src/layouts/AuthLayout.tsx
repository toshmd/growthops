import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const validateSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            throw new Error('Invalid user session');
          }
        }

        if (mounted) {
          setIsAuthenticated(!!session);
          setIsValidating(false);
        }
      } catch (error) {
        console.error('Session validation error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsValidating(false);
          toast({
            title: "Authentication Error",
            description: "Please sign in again",
            variant: "destructive",
          });
        }
      }
    };

    validateSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (mounted) {
          setIsAuthenticated(event === 'SIGNED_IN');
          if (event === 'SIGNED_OUT') {
            toast({
              title: "Signed out",
              description: "You have been signed out successfully",
            });
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  if (isValidating) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-background"
        role="status"
        aria-label="Validating authentication"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-12 bg-muted rounded-full mx-auto" />
          <div className="h-4 w-32 bg-muted rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="focus-visible:outline-none" tabIndex={-1}>
      {children}
    </div>
  );
};