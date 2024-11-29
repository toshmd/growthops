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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit2, Trash2 } from "lucide-react";
import CreateOutcome from "./CreateOutcome";

const ManageOutcomes = () => {
  const { toast } = useToast();
  const [newGoal, setNewGoal] = useState("");
  const [showCreateOutcome, setShowCreateOutcome] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [editingGoal, setEditingGoal] = useState<{ id: string; name: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'goal' | 'outcome', id: string } | null>(null);

  // Mock data - in a real app, this would come from an API
  const mockOutcomes = {
    "Revenue Growth": [
      { id: 1, title: "Increase Sales Pipeline", interval: "weekly", year: 2024 },
      { id: 2, title: "Customer Retention Rate", interval: "quarterly", year: 2024 },
    ],
    "Operational Efficiency": [
      { id: 3, title: "Process Optimization Review", interval: "monthly", year: 2024 },
      { id: 4, title: "Resource Utilization Analysis", interval: "annual", year: 2025 },
    ],
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      toast({
        title: "Goal Added",
        description: `Goal "${newGoal}" has been created.`,
      });
      setNewGoal("");
    }
  };

  const handleEditGoal = (goalName: string) => {
    setEditingGoal({ id: goalName, name: goalName });
  };

  const handleUpdateGoal = () => {
    if (editingGoal) {
      toast({
        title: "Goal Updated",
        description: `Goal has been updated successfully.`,
      });
      setEditingGoal(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (showDeleteConfirm) {
      toast({
        title: `${showDeleteConfirm.type === 'goal' ? 'Goal' : 'Outcome'} Deleted`,
        description: `The ${showDeleteConfirm.type} has been deleted successfully.`,
      });
      setShowDeleteConfirm(null);
    }
  };

  const handleCreateOutcome = (goal: string) => {
    setSelectedGoal(goal);
    setShowCreateOutcome(true);
  };

  const filteredOutcomes = Object.entries(mockOutcomes).reduce((acc, [goal, outcomes]) => {
    const filteredGoalOutcomes = outcomes.filter(
      (outcome) => outcome.year.toString() === selectedYear
    );
    if (filteredGoalOutcomes.length > 0) {
      acc[goal] = filteredGoalOutcomes;
    }
    return acc;
  }, {} as Record<string, typeof mockOutcomes[keyof typeof mockOutcomes]>);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Outcomes</h1>
        <Select
          value={selectedYear}
          onValueChange={setSelectedYear}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
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
        {Object.entries(filteredOutcomes).map(([goal, outcomes]) => (
          <AccordionItem key={goal} value={goal}>
            <AccordionTrigger className="text-lg">
              <div className="flex justify-between items-center w-full pr-4">
                <span>{goal}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditGoal(goal);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm({ type: 'goal', id: goal });
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
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
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteConfirm({ type: 'outcome', id: outcome.id.toString() })}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          <Input
            value={editingGoal?.name || ""}
            onChange={(e) => setEditingGoal(prev => prev ? { ...prev, name: e.target.value } : null)}
            className="mt-4"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingGoal(null)}>Cancel</Button>
            <Button onClick={handleUpdateGoal}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {showDeleteConfirm?.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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