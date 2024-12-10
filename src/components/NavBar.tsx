import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { NavSkeleton } from "./nav/NavSkeleton";
import { NavError } from "./nav/NavError";
import { NavContent } from "./nav/NavContent";
import { useToast } from "@/components/ui/use-toast";

const NavBar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
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
        console.error('Error checking user:', error);
        setError(error.message);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial check
    checkUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return <NavSkeleton />;
  }

  if (error) {
    return <NavError error={error} />;
  }

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 border-r bg-sidebar-background">
      <NavContent />
    </nav>
  );
};

export default NavBar;