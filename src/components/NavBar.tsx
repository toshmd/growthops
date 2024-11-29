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
    const checkUserSetup = async () => {
      try {
        setError(null);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setError("No active session found. Please log in again.");
          setIsLoading(false);
          return;
        }

        // First check if user has a profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile check error:', profileError);
          setError("Profile setup incomplete. Please try logging out and back in.");
          setIsLoading(false);
          return;
        }

        // Then check if the user has a people record
        const { data: peopleData, error: peopleError } = await supabase
          .from('people')
          .select('is_advisor')
          .eq('user_id', session.user.id)
          .single();

        if (peopleError && peopleError.code !== 'PGRST116') {
          console.error('People table error:', peopleError);
          setError("Database error. Please try again later.");
          setIsLoading(false);
          return;
        }

        // If no people record exists, create one with the current user's ID
        if (!peopleData) {
          const { data: newPeopleData, error: createError } = await supabase
            .from('people')
            .insert([{ 
              user_id: session.user.id,
              role: 'user',
              is_advisor: false
            }])
            .select('is_advisor')
            .single();

          if (createError) {
            console.error('Error creating people record:', createError);
            toast({
              title: "Error",
              description: "Failed to set up your account. Please contact support.",
              variant: "destructive",
            });
            setError("Error setting up your account. Please contact support.");
            setIsLoading(false);
            return;
          }

          setIsAdvisor(false);
        } else {
          setIsAdvisor(!!peopleData.is_advisor);
        }

      } catch (error: any) {
        console.error('Error in checkUserSetup:', error);
        setError(`Unexpected error. Please try again later.`);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSetup();
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