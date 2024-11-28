import { format, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ReportingDateStatus } from "@/types/process";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import ActionItems from "./ActionItems";

interface ReportingDateCardProps {
  date: Date;
  status?: ReportingDateStatus;
  statusColor: string;
  onUpdate: () => void;
}

const ReportingDateCard = ({ date, status, statusColor, onUpdate }: ReportingDateCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(status?.notes || "");
  const [actionItems, setActionItems] = useState(status?.actionItems || []);

  const handleQuickStatusUpdate = (newStatus: "completed" | "blocked" | "pending") => {
    onUpdate();
    setIsEditing(false);
  };

  const getStatusIcon = (status?: string) => {
    if (!status || status === "pending") return <Clock className="h-4 w-4 text-warning" />;
    if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-success" />;
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  const isOverdue = isPast(date) && (!status || status.status !== "completed");

  return (
    <div className={`p-4 rounded-lg border ${statusColor}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium">{format(date, "PPP")}</p>
            {!isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickStatusUpdate("completed")}
                  className="text-success hover:text-success hover:bg-success/10"
                >
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickStatusUpdate("blocked")}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {status && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {getStatusIcon(status.status)}
              <span>{status.status === "completed" ? "Completed" : 
                     status.status === "blocked" ? "Blocked" : "Pending"}</span>
              {isOverdue && (
                <Badge variant="destructive" className="ml-2">Overdue</Badge>
              )}
            </div>
          )}

          {isEditing && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="h-20"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Action Items</label>
                <ActionItems
                  items={actionItems}
                  onUpdate={setActionItems}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => handleQuickStatusUpdate("completed")} className="flex-1">
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!isEditing && status?.notes && (
            <p className="mt-2 text-sm text-gray-600">Notes: {status.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportingDateCard;