import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Process } from "@/types/process";
import ProcessReportingDates from "./ProcessReportingDates";
import { Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ProcessCardProps {
  process: Process;
  onUpdateStatus: (processId: number, status: string, notes: string) => void;
  onUpdateReportingDate: (processId: number, date: Date) => void;
}

const ProcessCard = ({ process, onUpdateStatus, onUpdateReportingDate }: ProcessCardProps) => {
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

  const handleQuickStatusUpdate = (newStatus: string) => {
    onUpdateStatus(process.id, newStatus, "Status updated via quick action");
    toast({
      title: "Status Updated",
      description: `Process status changed to ${newStatus}`,
    });
  };

  return (
    <Card className={`p-6 mb-6 transition-all hover:shadow-md ${getStatusColor(process.status)}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          {getStatusIcon(process.status)}
          <div>
            <h2 className="text-xl font-semibold">{process.title}</h2>
            <p className="text-gray-600 mt-1">{process.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge 
            variant={process.status === "done" ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            {process.interval}
          </Badge>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickStatusUpdate("incomplete")}
              className="text-warning hover:text-warning"
            >
              Mark Incomplete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickStatusUpdate("done")}
              className="text-success hover:text-success"
            >
              Mark Complete
            </Button>
          </div>
        </div>
      </div>

      <ProcessReportingDates 
        process={process}
        onUpdateReportingDate={onUpdateReportingDate}
      />
    </Card>
  );
};

export default ProcessCard;