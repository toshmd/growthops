import { useEffect, useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavSkeleton } from "./nav/NavSkeleton";
import { NavError } from "./nav/NavError";
import { NavContent } from "./nav/NavContent";
import { useToast } from "@/components/ui/use-toast";

const MemoizedNavContent = memo(NavContent);
MemoizedNavContent.displayName = 'MemoizedNavContent';

const NavBar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuthError = useCallback((error: Error) => {
    console.error('Error checking user:', error);
    setError(error.message);
    toast({
      title: "Authentication Error",
      description: "Please sign in again",
      variant: "destructive",
    });
    navigate('/login');
  }, [navigate, toast]);

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (!user) {
          console.log("No authenticated user found, redirecting to login");
          navigate('/login');
          return;
        }
      } catch (error: any) {
        if (mounted) {
          handleAuthError(error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_OUT' && mounted) {
        navigate('/login');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, handleAuthError]);

  if (isLoading) {
    return <NavSkeleton />;
  }

  if (error) {
    return <NavError error={error} />;
  }

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 border-r bg-sidebar-background">
      <MemoizedNavContent />
    </nav>
  );
};

export default memo(NavBar);