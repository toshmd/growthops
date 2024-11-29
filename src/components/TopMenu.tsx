import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, Settings, LogOut, UserCog } from "lucide-react";
import CompanySelector from "./company/CompanySelector";
import CompanySelectionModal from "./company/CompanySelectionModal";
import { useCompany } from "@/contexts/CompanyContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const TopMenu = () => {
  const { companies, selectedCompanyId, setSelectedCompanyId } = useCompany();
  const [view, setView] = useState<'companies' | 'advisor'>('companies');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };
    loadProfile();
  }, []);

  const handleAdvisorClick = () => {
    setView('advisor');
    navigate('/advisor');
  };

  const handleCompaniesClick = () => {
    setView('companies');
    setIsCompanyModalOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="fixed top-0 right-0 left-64 h-16 bg-background border-b z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex rounded-lg border p-1 bg-muted/30">
            <Button
              variant={view === 'companies' ? 'default' : 'ghost'}
              size="sm"
              onClick={handleCompaniesClick}
              className="relative"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Companies
            </Button>
            <Button
              variant={view === 'advisor' ? 'default' : 'ghost'}
              size="sm"
              onClick={handleAdvisorClick}
              className="relative"
            >
              <UserCog className="h-4 w-4 mr-2" />
              Advisor
            </Button>
          </div>
          
          {view === 'companies' && (
            <CompanySelector
              companies={companies}
              selectedCompanyId={selectedCompanyId}
              onCompanyChange={setSelectedCompanyId}
            />
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar>
              <AvatarImage src="" alt={profile?.first_name} />
              <AvatarFallback>
                {profile ? `${profile.first_name?.[0]}${profile.last_name?.[0]}` : '??'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium">
                {profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile?.title || 'No title set'}
              </p>
            </div>
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

      <CompanySelectionModal 
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />
    </div>
  );
};

export default TopMenu;