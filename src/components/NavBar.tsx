import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NavSkeleton } from "./nav/NavSkeleton";
import { NavError } from "./nav/NavError";
import { NavContent } from "./nav/NavContent";

const NavBar = () => {
  const [isAdvisor, setIsAdvisor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          .maybeSingle();

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
          .maybeSingle();

        if (peopleError) {
          console.error('People table error:', peopleError);
          setError("Database error. Please try again later.");
          setIsLoading(false);
          return;
        }

        // If no people record exists, create one
        if (!peopleData) {
          const { error: createError } = await supabase
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
  }, []);

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