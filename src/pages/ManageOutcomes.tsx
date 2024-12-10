import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CreateOutcome from "./CreateOutcome";
import ManageOutcomesHeader from "@/components/manage-outcomes/ManageOutcomesHeader";
import OutcomesList from "@/components/manage-outcomes/OutcomesList";
import DeleteConfirmDialog from "@/components/manage-outcomes/DeleteConfirmDialog";
import EditGoalDialog from "@/components/manage-outcomes/EditGoalDialog";
import AddGoalForm from "@/components/manage-outcomes/AddGoalForm";
import ManageOutcomesLoading from "@/components/manage-outcomes/ManageOutcomesLoading";
import { useCompany } from "@/contexts/CompanyContext";

const ManageOutcomes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedCompanyId } = useCompany();
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

  // Fetch outcomes from Supabase
  const { data: outcomes = [], isLoading } = useQuery({
    queryKey: ['outcomes', selectedYear, selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) {
        throw new Error("No company selected");
      }

      const { data, error } = await supabase
        .from('outcomes')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .gte('start_date', `${selectedYear}-01-01`)
        .lte('start_date', `${selectedYear}-12-31`);
      
      if (error) {
        toast({
          title: "Error loading outcomes",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
    enabled: !!selectedCompanyId,
  });

  // Memoize grouped outcomes to prevent unnecessary recalculations
  const groupedOutcomes = useMemo(() => {
    return outcomes.reduce((acc, outcome) => {
      const goalCategory = outcome.title.split(':')[0] || outcome.title;
      if (!acc[goalCategory]) {
        acc[goalCategory] = [];
      }
      acc[goalCategory].push({
        id: outcome.id,
        title: outcome.title.split(':')[1] || outcome.title,
        interval: outcome.interval,
        year: new Date(outcome.created_at).getFullYear()
      });
      return acc;
    }, {} as Record<string, any[]>);
  }, [outcomes]);

  // Add outcome mutation
  const addOutcomeMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!selectedCompanyId) {
        throw new Error("No company selected");
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from('outcomes')
        .insert([
          {
            title,
            company_id: selectedCompanyId,
            interval: 'monthly',
            start_date: new Date().toISOString(),
            next_due: new Date().toISOString(),
            description: '',
            created_by: session.session.user.id
          }
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outcomes'] });
      toast({
        title: "Goal Added",
        description: `Goal "${newGoal}" has been created.`,
      });
      setNewGoal("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add goal. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update outcome mutation
  const updateOutcomeMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { error } = await supabase
        .from('outcomes')
        .update({ title })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outcomes'] });
      toast({
        title: "Goal Updated",
        description: "Goal has been updated successfully.",
      });
      setEditingGoal(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update goal. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete outcome mutation
  const deleteOutcomeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('outcomes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outcomes'] });
      toast({
        title: "Deleted",
        description: `The ${showDeleteConfirm?.type} has been deleted successfully.`,
      });
      setShowDeleteConfirm(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleAddGoal = () => {
    if (!selectedCompanyId) {
      toast({
        title: "Error",
        description: "Please select a company first.",
        variant: "destructive"
      });
      return;
    }

    if (newGoal.trim()) {
      addOutcomeMutation.mutate(newGoal);
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
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (showDeleteConfirm) {
      deleteOutcomeMutation.mutate(showDeleteConfirm.id);
    }
  };

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

      <AddGoalForm
        newGoal={newGoal}
        onNewGoalChange={setNewGoal}
        onAddGoal={handleAddGoal}
      />

      <OutcomesList
        groupedOutcomes={groupedOutcomes}
        searchQuery={searchQuery}
        onEdit={(goal) => setEditingGoal({ id: goal, name: goal })}
        onDelete={(goal) => setShowDeleteConfirm({ type: "goal", id: goal })}
        onAddOutcome={(goal) => {
          setSelectedGoal(goal);
          setShowCreateOutcome(true);
        }}
      />

      <EditGoalDialog
        editingGoal={editingGoal}
        onClose={() => setEditingGoal(null)}
        onSave={handleUpdateGoal}
        onNameChange={(name) =>
          setEditingGoal((prev) => (prev ? { ...prev, name } : null))
        }
      />

      <DeleteConfirmDialog
        showDeleteConfirm={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
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