import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CreateOutcome from "./CreateOutcome";

// Mock data - in a real app, this would come from an API
const mockOutcomes = {
  "Revenue Growth": [
    { id: 1, title: "Increase Sales Pipeline", interval: "weekly" },
    { id: 2, title: "Customer Retention Rate", interval: "quarterly" },
  ],
  "Operational Efficiency": [
    { id: 3, title: "Process Optimization Review", interval: "monthly" },
    { id: 4, title: "Resource Utilization Analysis", interval: "annual" },
  ],
};

const ManageOutcomes = () => {
  const { toast } = useToast();
  const [newGoal, setNewGoal] = useState("");
  const [showCreateOutcome, setShowCreateOutcome] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      toast({
        title: "Goal Added",
        description: `Goal "${newGoal}" has been created.`,
      });
      setNewGoal("");
    }
  };

  const handleCreateOutcome = (goal: string) => {
    setSelectedGoal(goal);
    setShowCreateOutcome(true);
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Outcomes</h1>
      
      <div className="mb-8 flex gap-4 items-center">
        <Input
          placeholder="Enter new goal"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleAddGoal}>Add Goal</Button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {Object.entries(mockOutcomes).map(([goal, outcomes]) => (
          <AccordionItem key={goal} value={goal}>
            <AccordionTrigger className="text-lg">
              <div className="flex justify-between items-center w-full pr-4">
                <span>{goal}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateOutcome(goal);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Outcome
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                {outcomes.map((outcome) => (
                  <div
                    key={outcome.id}
                    className="flex justify-between items-center p-4 rounded-lg border bg-card"
                  >
                    <div>
                      <h3 className="font-medium">{outcome.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Interval: {outcome.interval}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog open={showCreateOutcome} onOpenChange={setShowCreateOutcome}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Outcome in {selectedGoal}</DialogTitle>
          </DialogHeader>
          <CreateOutcome />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageOutcomes;