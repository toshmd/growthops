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
        console.log("Starting user setup check...");
        setError(null);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.error("No active session found");
          setError("No active session found. Please log in again.");
          setIsLoading(false);
          return;
        }

        console.log("Session found for user:", session.user.id);

        // First check if user has a profile
        console.log("Checking for existing profile...");
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.log("Profile check result:", { profileError });
          // If profile doesn't exist, create it
          if (profileError.code === 'PGRST116') {
            console.log("Profile not found, creating new profile...");
            const { error: createProfileError } = await supabase
              .from('profiles')
              .insert([{
                id: session.user.id,
                first_name: session.user.user_metadata?.first_name || '',
                last_name: session.user.user_metadata?.last_name || ''
              }]);

            if (createProfileError) {
              console.error('Profile creation error:', createProfileError);
              setError(`Failed to create user profile: ${createProfileError.message}`);
              setIsLoading(false);
              return;
            }
            console.log("Profile created successfully");
          } else {
            console.error('Profile check error:', profileError);
            setError(`Profile setup error: ${profileError.message}`);
            setIsLoading(false);
            return;
          }
        } else {
          console.log("Existing profile found");
        }

        // Then check if the user has a people record
        console.log("Checking for existing people record...");
        const { data: peopleData, error: peopleError } = await supabase
          .from('people')
          .select('is_advisor')
          .eq('user_id', session.user.id)
          .single();

        console.log("People check result:", { peopleData, peopleError });

        if (peopleError) {
          // If people record doesn't exist, create one
          if (peopleError.code === 'PGRST116') {
            console.log("People record not found, creating new record...");
            const { data: newPeopleData, error: createError } = await supabase
              .from('people')
              .insert([{ 
                user_id: session.user.id,
                role: 'user',
                is_advisor: false
              }])
              .select('is_advisor')
              .single();

            console.log("People creation result:", { newPeopleData, createError });

            if (createError) {
              console.error('Error creating people record:', createError);
              const errorMessage = `Failed to create people record: ${createError.message}`;
              console.error(errorMessage);
              toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
              });
              setError(errorMessage);
              setIsLoading(false);
              return;
            }

            setIsAdvisor(false);
            console.log("People record created successfully");
          } else {
            const errorMessage = `Database error: ${peopleError.message}`;
            console.error(errorMessage);
            setError(errorMessage);
            setIsLoading(false);
            return;
          }
        } else {
          console.log("Setting advisor status:", peopleData.is_advisor);
          setIsAdvisor(!!peopleData.is_advisor);
        }

      } catch (error: any) {
        const errorMessage = `Unexpected error: ${error.message}`;
        console.error('Error in checkUserSetup:', error);
        setError(errorMessage);
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