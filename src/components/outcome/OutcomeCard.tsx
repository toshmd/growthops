import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Outcome } from "@/types/outcome";
import OutcomeReportingDates from "./OutcomeReportingDates";
import { Clock, CheckCircle2, AlertCircle, Calendar, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { isPast } from "date-fns";

interface OutcomeCardProps {
  outcome: Outcome;
  onUpdateStatus: (outcomeId: number, status: string, notes: string) => void;
  onUpdateReportingDate: (outcomeId: number, date: Date) => void;
  teamName?: string;
}

const OutcomeCard = ({ outcome, onUpdateStatus, onUpdateReportingDate, teamName }: OutcomeCardProps) => {
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "incomplete":
        return <Clock className="h-5 w-5 text-warning" />;
      default:
        return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const calculateOutcomeStatus = () => {
    if (!outcome.reportingDates || outcome.reportingDates.length === 0) return "incomplete";
    
    const hasOverdue = outcome.reportingDates.some(date => 
      isPast(date.date) && date.status !== "completed"
    );
    
    if (hasOverdue) return "incomplete";
    
    const allCompleted = outcome.reportingDates.every(date => 
      !isPast(date.date) || date.status === "completed"
    );
    
    return allCompleted ? "done" : "incomplete";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "border-l-4 border-l-success bg-success/5";
      case "incomplete":
        return "border-l-4 border-l-warning bg-warning/5";
      default:
        return "border-l-4 border-l-destructive bg-destructive/5";
    }
  };

  return (
    <Card className={`p-6 mb-6 transition-all hover:shadow-md ${getStatusColor(calculateOutcomeStatus())}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          {getStatusIcon(calculateOutcomeStatus())}
          <div>
            <h2 className="text-xl font-semibold">{outcome.title}</h2>
            <p className="text-gray-600 mt-1">{outcome.description}</p>
            {teamName && (
              <div className="flex items-center gap-2 mt-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary">{teamName}</Badge>
              </div>
            )}
          </div>
        </div>
        <Badge 
          variant={calculateOutcomeStatus() === "done" ? "default" : "secondary"}
          className="flex items-center gap-1"
        >
          <Calendar className="h-4 w-4" />
          {outcome.interval}
        </Badge>
      </div>

      <OutcomeReportingDates 
        outcome={outcome}
        onUpdateReportingDate={onUpdateReportingDate}
      />
    </Card>
  );
};

export default OutcomeCard;