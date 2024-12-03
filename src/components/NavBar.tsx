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
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError("No authenticated user found");
          return;
        }

        const { data, error: queryError } = await supabase
          .from('people')
          .select('is_advisor')
          .eq('user_id', user.id)
          .maybeSingle();

        if (queryError) {
          throw queryError;
        }

        setIsAdvisor(!!data?.is_advisor);
      } catch (error: any) {
        console.error('Error checking user role:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load user role",
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