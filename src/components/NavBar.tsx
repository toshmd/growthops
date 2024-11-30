import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NavSkeleton } from "./nav/NavSkeleton";
import { NavError } from "./nav/NavError";
import { NavContent } from "./nav/NavContent";
import { useToast } from "@/components/ui/use-toast";

const NavBar = () => {
  const [isAdvisor, setIsAdvisor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setError("No active session found. Please log in again.");
          return;
        }

        const { data: peopleData, error: peopleError } = await supabase
          .from('people')
          .select('is_advisor')
          .eq('user_id', session.user.id)
          .single();

        if (peopleError) {
          if (peopleError.code !== 'PGRST116') {
            throw peopleError;
          }
          setIsAdvisor(false);
        } else {
          setIsAdvisor(!!peopleData.is_advisor);
        }

      } catch (error: any) {
        const errorMessage = `Error checking user role: ${error.message}`;
        console.error(errorMessage);
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [toast]);

  if (isLoading) {
    return <NavSkeleton />;
  }

  if (error) {
    return <NavError error={error} />;
  }

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 border-r bg-sidebar-background">
      <NavContent isAdvisor={isAdvisor} />
    </nav>
  );
};

export default NavBar;