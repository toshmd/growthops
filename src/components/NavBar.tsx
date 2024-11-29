import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, FolderPlus, ListTodo, BarChart3, CheckSquare, Users, Group } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="fixed left-0 top-0 h-screen w-64 border-r bg-sidebar-background">
      <div className="flex h-full flex-col py-4">
        <div className="flex flex-col space-y-2 px-3">
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
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
            <Link to="/dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start">
            <Link to="/tasks">
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
            </Link>
          </Button>
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
        </div>
      </div>
    </nav>
  );
};

export default NavBar;