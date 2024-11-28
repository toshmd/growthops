import { Process } from "@/types/process";
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

interface ProcessStatusUpdateProps {
  process: Process;
  onUpdateStatus: (processId: number, status: string, notes: string) => void;
}

const ProcessStatusUpdate = ({ process, onUpdateStatus }: ProcessStatusUpdateProps) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-4">
      <h3 className="font-medium mb-4">Update Process Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any relevant notes..."
            className="h-20"
          />
        </div>
      </div>
      
      <Button
        onClick={() => {
          onUpdateStatus(process.id, selectedStatus, notes);
          setSelectedStatus("");
          setNotes("");
        }}
        className="mt-4"
        disabled={!selectedStatus}
      >
        Update Status
      </Button>
    </div>
  );
};

export default ProcessStatusUpdate;