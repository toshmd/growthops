import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ReportingDateStatus } from "@/types/process";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface ReportingDateCardProps {
  date: Date;
  status?: ReportingDateStatus;
  statusColor: string;
  onUpdate: () => void;
}

const ReportingDateCard = ({ date, status, statusColor, onUpdate }: ReportingDateCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status?.status || "pending");
  const [notes, setNotes] = useState(status?.notes || "");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "blocked":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const handleUpdate = () => {
    onUpdate();
    setIsEditing(false);
  };

  return (
    <div className={`p-4 rounded-lg border ${statusColor}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <p className="font-medium">{format(date, "PPP")}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Update"}
            </Button>
          </div>
          
          {isEditing ? (
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) => setSelectedStatus(value as "pending" | "completed" | "blocked")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed" className="text-green-600">Complete</SelectItem>
                    <SelectItem value="pending" className="text-yellow-600">Pending</SelectItem>
                    <SelectItem value="blocked" className="text-red-600">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="h-20"
                />
              </div>
              
              <Button onClick={handleUpdate} className="w-full">
                Save Changes
              </Button>
            </div>
          ) : (
            status && (
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  Status:{" "}
                  <Badge 
                    variant={status.status === "completed" ? "default" : "secondary"}
                    className={getStatusColor(status.status)}
                  >
                    {status.status === "completed" ? "Complete" : 
                     status.status === "blocked" ? "Blocked" : "Pending"}
                  </Badge>
                </p>
                {status.notes && <p className="mt-1">Notes: {status.notes}</p>}
                <p className="mt-1 text-xs">
                  Updated by {status.updatedBy} on{" "}
                  {format(status.updatedAt || new Date(), "PPp")}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportingDateCard;