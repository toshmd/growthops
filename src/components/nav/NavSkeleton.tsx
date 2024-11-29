import { Skeleton } from "@/components/ui/skeleton";

export const NavSkeleton = () => (
  <nav className="fixed left-0 top-0 h-screen w-64 border-r bg-sidebar-background">
    <div className="flex h-full flex-col py-4">
      <div className="animate-pulse space-y-4 px-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-8 rounded" />
        ))}
      </div>
    </div>
  </nav>
);