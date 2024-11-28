import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Process } from "@/types/process";
import ProcessReportingDates from "./ProcessReportingDates";

interface ProcessCardProps {
  process: Process;
  onUpdateStatus: (processId: number, status: string, notes: string) => void;
  onUpdateReportingDate: (processId: number, date: Date) => void;
}

const ProcessCard = ({ process, onUpdateStatus, onUpdateReportingDate }: ProcessCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold">{process.title}</h2>
          <p className="text-gray-600 mt-1">{process.description}</p>
        </div>
        <Badge variant={process.status === "done" ? "default" : "secondary"}>
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