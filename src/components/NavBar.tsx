import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, FolderPlus, ListTodo, BarChart3, CheckSquare, Users, Group, Building2, UserCog, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

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
          return;
        }

        // Then check if the user has a people record
        const { data: peopleData, error: peopleError } = await supabase
          .from('people')
          .select('is_advisor, user_id')
          .eq('user_id', session.user.id)
          .single();

        if (peopleError) {
          if (peopleError.code === 'PGRST116') {
            // Create a people record for the user
            const { error: createError } = await supabase
              .from('people')
              .insert([
                { 
                  user_id: session.user.id,
                  role: 'user'
                }
              ]);

            if (createError) {
              console.error('Error creating people record:', createError);
              setError("Error setting up your account. Please contact support.");
              return;
            }

            // Set as non-advisor by default
            setIsAdvisor(false);
          } else {
            console.error('People table error:', peopleError);
            setError("Database error. Please try again later.");
            return;
          }
        } else {
          setIsAdvisor(!!peopleData?.is_advisor);
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
    return (
      <nav className="fixed left-0 top-0 h-screen w-64 border-r bg-sidebar-background">
        <div className="flex h-full flex-col py-4">
          <div className="animate-pulse space-y-4 px-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 rounded" />
            ))}
          </div>
        </div>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className="fixed left-0 top-0 h-screen w-64 border-r bg-sidebar-background">
        <div className="flex h-full flex-col py-4 px-3">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2 text-sm">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 border-r bg-sidebar-background">
      <div className="flex h-full flex-col py-4">
        <div className="flex flex-col space-y-2 px-3">
          <div className="mb-2">
            <h2 className="px-2 text-lg font-semibold">Dashboard</h2>
          </div>
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link to="/dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>

          <div className="mt-6 mb-2">
            <h2 className="px-2 text-lg font-semibold">Outcomes</h2>
          </div>
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link to="/manage">
              <FolderPlus className="h-4 w-4 mr-2" />
              Manage Outcomes
            </Link>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link to="/my-outcomes">
              <ListTodo className="h-4 w-4 mr-2" />
              My Outcomes
            </Link>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link to="/tasks">
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
            </Link>
          </Button>

          <div className="mt-6 mb-2">
            <h2 className="px-2 text-lg font-semibold">Team</h2>
          </div>
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link to="/users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </Link>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link to="/teams">
              <Group className="h-4 w-4 mr-2" />
              Teams
            </Link>
          </Button>

          {isAdvisor && (
            <>
              <div className="mt-6 mb-2">
                <h2 className="px-2 text-lg font-semibold">Advisor</h2>
              </div>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link to="/advisor/companies">
                  <Building2 className="h-4 w-4 mr-2" />
                  Companies
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link to="/advisor/administrators">
                  <UserCog className="h-4 w-4 mr-2" />
                  Administrators
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;