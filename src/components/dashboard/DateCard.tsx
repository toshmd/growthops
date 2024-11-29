import { format, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp, Edit2 } from "lucide-react";
import { useState } from "react";
import ActionItems from "../process/ActionItems";
import { useToast } from "../ui/use-toast";

interface DateCardProps {
  date: Date;
  process: any;
  status: string;
}

export const DateCard = ({ date, process, status }: DateCardProps) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState(status === "done" ? "Completed on time" : "");
  const [actionItems, setActionItems] = useState<any[]>([]);

  const handleUpdateNotes = (processId: number, date: Date, notes: string) => {
    toast({
      title: "Notes Updated",
      description: "The notes have been saved successfully.",
    });
  };

  const handleUpdateActionItems = (processId: number, date: Date, items: any[]) => {
    toast({
      title: "Action Items Updated",
      description: "The action items have been saved successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-success/10 border-success";
      case "blocked":
        return "bg-destructive/10 border-destructive";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className={`p-4 rounded-lg border ${getStatusColor(status)}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <p className="font-medium">{format(date, "PPP")}</p>
                {isPast(date) && status !== "done" && (
                  <Badge 
                    variant="destructive" 
                    className="text-xs px-2 py-0.5"
                  >
                    Overdue
                  </Badge>
                )}
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <Edit2 className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes..."
                    className="h-20"
                    onBlur={() => handleUpdateNotes(process.id, date, notes)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Action Items</label>
                  <ActionItems
                    items={actionItems}
                    onUpdate={(items) => {
                      setActionItems(items);
                      handleUpdateActionItems(process.id, date, items);
                    }}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </div>
      </div>
    </Collapsible>
  );
};