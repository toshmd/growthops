import { Skeleton } from "@/components/ui/skeleton";

const ManageOutcomesLoading = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
};

export default ManageOutcomesLoading;