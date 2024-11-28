import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, FolderPlus, ListTodo, BarChart3, CheckSquare } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="border-b">
      <div className="container flex h-14 items-center">
        <div className="flex gap-6 md:gap-10">
          <Button variant="ghost" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/manage">
              <FolderPlus className="h-4 w-4 mr-2" />
              Manage Processes
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/my-processes">
              <ListTodo className="h-4 w-4 mr-2" />
              My Processes
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/tasks">
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;