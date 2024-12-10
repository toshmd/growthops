import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import { useState, useEffect, memo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ProfileInfo = memo(({ profile }: { profile: any }) => (
  <div className="flex flex-col space-y-1 p-2">
    <p className="text-sm font-medium text-foreground">
      {profile ? `${profile.first_name || 'New'} ${profile.last_name || 'User'}` : 'Loading...'}
    </p>
    <p className="text-xs text-muted-foreground">
      {profile?.title || 'Welcome! Update your profile in settings.'}
    </p>
  </div>
));
ProfileInfo.displayName = 'ProfileInfo';

const AvatarComponent = memo(({ profile }: { profile: any }) => (
  <Avatar>
    <AvatarImage 
      src="" 
      alt={profile?.first_name ? `${profile.first_name}'s avatar` : 'User avatar'} 
    />
    <AvatarFallback aria-label="User initials">
      {profile ? `${profile.first_name?.[0] || 'N'}${profile.last_name?.[0] || 'U'}` : '??'}
    </AvatarFallback>
  </Avatar>
));
AvatarComponent.displayName = 'AvatarComponent';

const TopMenu = () => {
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error('Error loading profile:', error);
            throw error;
          }
          
          // If we got data, use it. Otherwise create a default profile object
          setProfile(data || {
            id: user.id,
            first_name: null,
            last_name: null,
            title: null
          });
        }
      } catch (error: any) {
        console.error('Error loading profile:', error);
        toast({
          title: "Error loading profile",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      }
    };

    loadProfile();
  }, [toast]);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  return (
    <header 
      className="fixed top-0 right-0 left-64 h-16 bg-background border-b z-50" 
      role="banner"
      aria-label="Top navigation"
    >
      <div className="h-full px-4 flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger 
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
            aria-label="Open user menu"
          >
            <AvatarComponent profile={profile} />
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56"
            aria-label="User menu"
          >
            <ProfileInfo profile={profile} />
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link 
                to="/settings" 
                className="flex items-center focus:bg-accent"
                role="menuitem"
              >
                <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
              role="menuitem"
            >
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default memo(TopMenu);