import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Building2, Users } from "lucide-react";

const AdvisorNavBar = () => {
  const links = [
    {
      href: "/advisor/companies",
      label: "Companies",
      icon: Building2,
      description: "Manage and monitor companies"
    },
    {
      href: "/advisor/administrators",
      label: "Administrators",
      icon: Users,
      description: "Manage administrator access"
    },
  ];

  return (
    <nav className="fixed left-0 top-0 w-64 h-screen bg-background border-r pt-16">
      <div className="flex flex-col gap-1 p-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative group",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <div className="flex flex-col">
                <span>{link.label}</span>
                <span className="text-xs text-muted-foreground hidden group-hover:block">
                  {link.description}
                </span>
              </div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default AdvisorNavBar;