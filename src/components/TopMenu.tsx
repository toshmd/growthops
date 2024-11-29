import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Building2, UserCog } from "lucide-react";
import CompanySelector from "./company/CompanySelector";
import { useCompany } from "@/contexts/CompanyContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Mock user data - replace with actual user data in production
const currentUser = {
  name: "John Doe",
  email: "john@example.com",
  photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
};

const TopMenu = () => {
  const { companies, selectedCompanyId, setSelectedCompanyId } = useCompany();
  const [view, setView] = useState<'companies' | 'advisor'>('companies');
  const navigate = useNavigate();

  const handleAdvisorClick = () => {
    setView('advisor');
    navigate('/advisor');
  };

  return (
    <div className="fixed top-0 right-0 left-64 h-16 bg-background border-b z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex rounded-lg border p-1 bg-muted/30">
            <Button
              variant={view === 'companies' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('companies')}
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
              <AvatarImage src={currentUser.photo} alt={currentUser.name} />
              <AvatarFallback>
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopMenu;