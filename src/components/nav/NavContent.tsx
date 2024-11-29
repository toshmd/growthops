import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  FolderPlus,
  ListTodo,
  BarChart3,
  CheckSquare,
  Users,
  Group,
  Building2,
  UserCog,
} from "lucide-react";

interface NavContentProps {
  isAdvisor: boolean;
}

export const NavContent = ({ isAdvisor }: NavContentProps) => (
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
);