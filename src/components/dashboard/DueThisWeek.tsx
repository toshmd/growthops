import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Outcome } from "@/types/outcome";

interface DueThisWeekProps {
  outcomes: Outcome[];
  isLoading?: boolean;
}

const DueThisWeek = ({ outcomes, isLoading }: DueThisWeekProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-2 animate-pulse">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!outcomes.length) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Due This Week</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground">No outcomes due this week</p>
          <p className="text-sm text-muted-foreground mt-1">
            Great job staying on top of things!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Due This Week</h3>
      </div>
      <div className="space-y-3">
        {outcomes.map((outcome) => (
          <div key={outcome.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex-1 min-w-0 pr-4">
              <p className="font-medium text-gray-900 truncate">{outcome.title}</p>
              <p className="text-xs text-gray-500">
                Due: {format(new Date(outcome.nextDue), "MMM d")}
              </p>
            </div>
            <Badge variant={outcome.status === 'done' ? 'default' : 'secondary'}>
              {outcome.status === 'done' ? 'Complete' : 'Pending'}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DueThisWeek;