import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { PlusCircle, ListChecks, LayoutDashboard } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Process Pulse Tracker
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Button variant="ghost" asChild>
              <Link to="/create" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Process
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/my-processes" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                My Processes
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;