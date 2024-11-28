import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ReportingDateStatus } from "@/types/process";

interface ReportingDateCardProps {
  date: Date;
  status?: ReportingDateStatus;
  statusColor: string;
  onUpdate: () => void;
}

const ReportingDateCard = ({ date, status, statusColor, onUpdate }: ReportingDateCardProps) => {
  return (
    <div className={`p-4 rounded-lg border ${statusColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{format(date, "PPP")}</p>
          {status && (
            <div className="mt-2 text-sm text-gray-600">
              <p>
                Status:{" "}
                <Badge variant={status.status === "completed" ? "default" : "secondary"}>
                  {status.status}
                </Badge>
              </p>
              {status.notes && <p className="mt-1">Notes: {status.notes}</p>}
              <p className="mt-1 text-xs">
                Updated by {status.updatedBy} on{" "}
                {format(status.updatedAt || new Date(), "PPp")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportingDateCard;