import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Building, Users } from "lucide-react";

const AdvisorNavBar = () => {
  const links = [
    {
      href: "/advisor/companies",
      label: "Companies",
      icon: Building,
    },
    {
      href: "/advisor/administrators",
      label: "Administrators",
      icon: Users,
    },
  ];

  return (
    <nav className="fixed left-0 top-0 w-64 h-screen bg-background border-r pt-16">
      <div className="space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default AdvisorNavBar;