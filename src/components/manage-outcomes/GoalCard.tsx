import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Edit2, Trash2, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GoalCardProps {
  goal: string;
  outcomes: any[];
  onEdit: (goal: string) => void;
  onDelete: (goal: string) => void;
  onAddOutcome: (goal: string) => void;
}

const GoalCard = ({ goal, outcomes, onEdit, onDelete, onAddOutcome }: GoalCardProps) => {
  return (
    <AccordionItem value={goal} className="border rounded-lg shadow-sm bg-card mb-4">
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="flex justify-between items-center w-full pr-4">
          <div className="flex items-center gap-3">
            <span className="font-medium">{goal}</span>
            <Badge variant="secondary" className="ml-2">
              {outcomes.length} outcomes
            </Badge>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(goal);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit goal</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(goal);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete goal</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-success hover:text-success"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddOutcome(goal);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add outcome</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 py-4">
        {outcomes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No outcomes yet.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => onAddOutcome(goal)}
            >
              Add your first outcome
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {outcomes.map((outcome) => (
              <div key={outcome.id} className="flex justify-between items-center p-4 rounded-lg border bg-card">
                <div>
                  <h3 className="font-medium">{outcome.title}</h3>
                  <p className="text-sm text-muted-foreground">Interval: {outcome.interval}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log(`Edit outcome: ${outcome.id}`)} // Replace with actual edit function
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => console.log(`Delete outcome: ${outcome.id}`)} // Replace with actual delete function
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default GoalCard;
