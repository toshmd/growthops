import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Process } from "@/types/process";
import ProcessReportingDates from "./ProcessReportingDates";
import { Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

interface ProcessCardProps {
  process: Process;
  onUpdateStatus: (processId: number, status: string, notes: string) => void;
  onUpdateReportingDate: (processId: number, date: Date) => void;
}

const ProcessCard = ({ process, onUpdateStatus, onUpdateReportingDate }: ProcessCardProps) => {
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
        <Badge 
          variant={process.status === "done" ? "default" : "secondary"}
          className="flex items-center gap-1"
        >
          <Calendar className="h-4 w-4" />
          {process.interval}
        </Badge>
      </div>

      <ProcessReportingDates 
        process={process}
        onUpdateReportingDate={onUpdateReportingDate}
      />
    </Card>
  );
};

export default ProcessCard;