import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Accordion } from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CreateOutcome from "./CreateOutcome";
import ManageOutcomesHeader from "@/components/manage-outcomes/ManageOutcomesHeader";
import GoalCard from "@/components/manage-outcomes/GoalCard";
import ManageOutcomesLoading from "@/components/manage-outcomes/ManageOutcomesLoading";

const ManageOutcomes = () => {
  const { toast } = useToast();
  const [newGoal, setNewGoal] = useState("");
  const [showCreateOutcome, setShowCreateOutcome] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [editingGoal, setEditingGoal] = useState<{ id: string; name: string } | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: "goal" | "outcome";
    id: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        title: `${
          showDeleteConfirm.type === "goal" ? "Goal" : "Outcome"
        } Deleted`,
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
      (outcome) =>
        outcome.year.toString() === selectedYear &&
        (goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
          outcome.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (filteredGoalOutcomes.length > 0 || goal.toLowerCase().includes(searchQuery.toLowerCase())) {
      acc[goal] = filteredGoalOutcomes;
    }
    return acc;
  }, {} as Record<string, typeof mockOutcomes[keyof typeof mockOutcomes]>);

  if (isLoading) {
    return <ManageOutcomesLoading />;
  }

  return (
    <div className="container py-8">
      <ManageOutcomesHeader
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="mb-8">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Enter new goal"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={handleAddGoal} className="bg-success hover:bg-success/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </div>

      {Object.keys(filteredOutcomes).length === 0 ? (
        <div className="text-center py-12 bg-muted/10 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-medium mb-2">No goals found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Start by adding your first goal"}
          </p>
          {!searchQuery && (
            <Button onClick={() => document.querySelector("input")?.focus()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Goal
            </Button>
          )}
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(filteredOutcomes).map(([goal, outcomes]) => (
            <GoalCard
              key={goal}
              goal={goal}
              outcomes={outcomes}
              onEdit={handleEditGoal}
              onDelete={(goal) => setShowDeleteConfirm({ type: "goal", id: goal })}
              onAddOutcome={handleCreateOutcome}
            />
          ))}
        </Accordion>
      )}

      <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          <Input
            value={editingGoal?.name || ""}
            onChange={(e) =>
              setEditingGoal((prev) => (prev ? { ...prev, name: e.target.value } : null))
            }
            className="mt-4"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingGoal(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateGoal}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {showDeleteConfirm?.type}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateOutcome} onOpenChange={setShowCreateOutcome}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Outcome in {selectedGoal}</DialogTitle>
          </DialogHeader>
          <CreateOutcome selectedYear={selectedYear} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageOutcomes;
