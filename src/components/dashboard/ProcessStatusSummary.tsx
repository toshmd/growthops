import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { isPast } from "date-fns";

interface ProcessStatusSummaryProps {
  process: any;
}

const ProcessStatusSummary = ({ process }: ProcessStatusSummaryProps) => {
  const completedDates = process.reportingDates?.filter(
    (date: any) => date.status === "completed"
  ) || [];

  const outstandingTasks = process.reportingDates?.filter(
    (date: any) => isPast(new Date(date.date)) && date.status !== "completed"
  ).length || 0;

  const latestCompletedDate = completedDates[completedDates.length - 1];

  return (
    <Card className="p-4 bg-muted/50">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Status Summary</span>
          <Badge variant={outstandingTasks > 0 ? "destructive" : "success"}>
            {outstandingTasks} outstanding tasks
          </Badge>
        </div>
        
        {latestCompletedDate && (
          <>
            <div className="text-sm">
              <span className="font-medium">Latest Completion:</span>{" "}
              {new Date(latestCompletedDate.date).toLocaleDateString()}
            </div>
            {latestCompletedDate.notes && (
              <div className="space-y-1">
                <span className="text-sm font-medium">Notes:</span>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {latestCompletedDate.notes.split('\n').map((note: string, index: number) => (
                    <li key={index}>{note.trim()}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default ProcessStatusSummary;