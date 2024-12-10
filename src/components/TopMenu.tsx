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

const ProfileInfo = memo(({ profile }: { profile: any }) => (
  <div className="flex flex-col space-y-1 p-2">
    <p className="text-sm font-medium">
      {profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}
    </p>
    <p className="text-xs text-muted-foreground">
      {profile?.title || 'No title set'}
    </p>
  </div>
));
ProfileInfo.displayName = 'ProfileInfo';

const AvatarComponent = memo(({ profile }: { profile: any }) => (
  <Avatar>
    <AvatarImage src="" alt={profile?.first_name} />
    <AvatarFallback>
      {profile ? `${profile.first_name?.[0]}${profile.last_name?.[0]}` : '??'}
    </AvatarFallback>
  </Avatar>
));
AvatarComponent.displayName = 'AvatarComponent';

const TopMenu = () => {
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

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
          
          if (error) throw error;
          setProfile(data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [navigate]);

  return (
    <div className="fixed top-0 right-0 left-64 h-16 bg-background border-b z-50">
      <div className="h-full px-4 flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <AvatarComponent profile={profile} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <ProfileInfo profile={profile} />
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default memo(TopMenu);