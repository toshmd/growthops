import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  ListTodo,
  BarChart3,
  CheckSquare,
  Users,
  Group,
} from "lucide-react";

export const NavContent = () => (
  <nav className="flex h-full flex-col py-4" role="navigation" aria-label="Main navigation">
    <div className="flex flex-col space-y-2 px-3">
      <div className="mb-2">
        <h2 className="px-2 text-lg font-semibold text-sidebar-primary" id="dashboard-nav">Dashboard</h2>
      </div>
      <Button 
        variant="ghost" 
        asChild 
        className="w-full justify-start focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2"
      >
        <Link to="/" aria-labelledby="home-link">
          <Home className="h-4 w-4 mr-2" aria-hidden="true" />
          <span id="home-link">Home</span>
        </Link>
      </Button>
      <Button 
        variant="ghost" 
        asChild 
        className="w-full justify-start focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2"
      >
        <Link to="/dashboard" aria-labelledby="dashboard-link">
          <BarChart3 className="h-4 w-4 mr-2" aria-hidden="true" />
          <span id="dashboard-link">Dashboard</span>
        </Link>
      </Button>

      <div className="mt-6 mb-2">
        <h2 className="px-2 text-lg font-semibold text-sidebar-primary" id="tasks-nav">Tasks</h2>
      </div>
      <Button 
        variant="ghost" 
        asChild 
        className="w-full justify-start focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2"
      >
        <Link to="/my-outcomes" aria-labelledby="outcomes-link">
          <ListTodo className="h-4 w-4 mr-2" aria-hidden="true" />
          <span id="outcomes-link">My Outcomes</span>
        </Link>
      </Button>
      <Button 
        variant="ghost" 
        asChild 
        className="w-full justify-start focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2"
      >
        <Link to="/tasks" aria-labelledby="tasks-link">
          <CheckSquare className="h-4 w-4 mr-2" aria-hidden="true" />
          <span id="tasks-link">Tasks</span>
        </Link>
      </Button>

      <div className="mt-6 mb-2">
        <h2 className="px-2 text-lg font-semibold text-sidebar-primary" id="team-nav">Team</h2>
      </div>
      <Button 
        variant="ghost" 
        asChild 
        className="w-full justify-start focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2"
      >
        <Link to="/users" aria-labelledby="users-link">
          <Users className="h-4 w-4 mr-2" aria-hidden="true" />
          <span id="users-link">Users</span>
        </Link>
      </Button>
      <Button 
        variant="ghost" 
        asChild 
        className="w-full justify-start focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2"
      >
        <Link to="/teams" aria-labelledby="teams-link">
          <Group className="h-4 w-4 mr-2" aria-hidden="true" />
          <span id="teams-link">Teams</span>
        </Link>
      </Button>
    </div>
  </nav>
);