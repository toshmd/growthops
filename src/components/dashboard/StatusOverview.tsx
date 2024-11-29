import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatusOverviewProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
  isLoading?: boolean;
}

const StatusOverview = ({ stats, isLoading }: StatusOverviewProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Overview</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!stats.total) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Overview</h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground">No outcomes yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start by creating your first outcome
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Overview</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Total Outcomes</span>
          <span className="font-semibold">{stats.total}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Completed</span>
          <span className="text-green-600 font-semibold">{stats.completed}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">In Progress</span>
          <span className="text-yellow-600 font-semibold">{stats.inProgress}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Overdue</span>
          <span className="text-red-600 font-semibold">{stats.overdue}</span>
        </div>
      </div>
    </Card>
  );
};

export default StatusOverview;