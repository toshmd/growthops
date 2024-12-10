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
        // Get session and validate user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) {
          // Double-check user validity
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (mounted) {
          setIsAuthenticated(event === 'SIGNED_IN');
        }
      } else if (event === 'SIGNED_IN') {
        // Validate new session
        try {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error || !user) throw new Error('Invalid session');
          if (mounted) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Auth state change validation error:', error);
          if (mounted) {
            setIsAuthenticated(false);
            toast({
              title: "Authentication Error",
              description: "Please sign in again",
              variant: "destructive",
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
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};