import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreateOutcome from "./CreateOutcome";
import ManageOutcomesHeader from "@/components/manage-outcomes/ManageOutcomesHeader";
import OutcomesList from "@/components/manage-outcomes/OutcomesList";
import DeleteConfirmDialog from "@/components/manage-outcomes/DeleteConfirmDialog";
import EditGoalDialog from "@/components/manage-outcomes/EditGoalDialog";
import AddGoalForm from "@/components/manage-outcomes/AddGoalForm";
import ManageOutcomesLoading from "@/components/manage-outcomes/ManageOutcomesLoading";
import { useOutcomesData } from "@/hooks/useOutcomesData";
import { useDebounce } from "@/hooks/useDebounce";

const ManageOutcomes = () => {
  const { toast } = useToast();
  const [newGoal, setNewGoal] = useState("");
  const [showCreateOutcome, setShowCreateOutcome] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [editingGoal, setEditingGoal] = useState<{ id: string; name: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: "goal" | "outcome";
    id: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Use custom hook for data fetching and mutations
  const {
    outcomes,
    isLoading,
    error,
    addOutcomeMutation,
    updateOutcomeMutation,
    deleteOutcomeMutation
  } = useOutcomesData(selectedYear);

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      addOutcomeMutation.mutate(newGoal, {
        onSuccess: () => {
          toast({
            title: "Goal Added",
            description: `Goal "${newGoal}" has been created.`,
          });
          setNewGoal("");
        }
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a goal title.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateGoal = () => {
    if (editingGoal) {
      updateOutcomeMutation.mutate({
        id: editingGoal.id,
        title: editingGoal.name,
      }, {
        onSuccess: () => {
          toast({
            title: "Goal Updated",
            description: "Goal has been updated successfully.",
          });
          setEditingGoal(null);
        }
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (showDeleteConfirm) {
      deleteOutcomeMutation.mutate(showDeleteConfirm.id, {
        onSuccess: () => {
          toast({
            title: "Deleted",
            description: `The ${showDeleteConfirm.type} has been deleted successfully.`,
          });
          setShowDeleteConfirm(null);
        }
      });
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error loading outcomes: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <ManageOutcomesHeader
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <AddGoalForm
        newGoal={newGoal}
        onNewGoalChange={setNewGoal}
        onAddGoal={handleAddGoal}
        isLoading={addOutcomeMutation.isPending}
      />

      {isLoading ? (
        <ManageOutcomesLoading />
      ) : (
        <OutcomesList
          outcomes={outcomes}
          searchQuery={debouncedSearchQuery}
          onEdit={(goal) => setEditingGoal({ id: goal, name: goal })}
          onDelete={(goal) => setShowDeleteConfirm({ type: "goal", id: goal })}
          onAddOutcome={(goal) => {
            setSelectedGoal(goal);
            setShowCreateOutcome(true);
          }}
          isUpdating={updateOutcomeMutation.isPending}
          isDeleting={deleteOutcomeMutation.isPending}
        />
      )}

      <EditGoalDialog
        editingGoal={editingGoal}
        onClose={() => setEditingGoal(null)}
        onSave={handleUpdateGoal}
        onNameChange={(name) =>
          setEditingGoal((prev) => (prev ? { ...prev, name } : null))
        }
        isLoading={updateOutcomeMutation.isPending}
      />

      <DeleteConfirmDialog
        showDeleteConfirm={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteOutcomeMutation.isPending}
      />

      <Dialog open={showCreateOutcome} onOpenChange={setShowCreateOutcome}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Outcome in {selectedGoal}</DialogTitle>
          </DialogHeader>
          <CreateOutcome selectedYear={selectedYear} onSuccess={() => setShowCreateOutcome(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageOutcomes;