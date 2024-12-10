import { Accordion } from "@/components/ui/accordion";
import { useMemo } from "react";
import GoalCard from "./GoalCard";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface OutcomesListProps {
  outcomes: any[];
  searchQuery: string;
  onEdit: (goal: string) => void;
  onDelete: (goal: string) => void;
  onAddOutcome: (goal: string) => void;
  isLoading?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  error?: Error | null;
}

const OutcomesList = ({ 
  outcomes, 
  searchQuery, 
  onEdit, 
  onDelete, 
  onAddOutcome,
  isLoading,
  error
}: OutcomesListProps) => {
  // Group outcomes by goal
  const groupedOutcomes = useMemo(() => {
    return outcomes.reduce((acc: Record<string, any[]>, outcome) => {
      const goal = outcome.title;
      if (!acc[goal]) {
        acc[goal] = [];
      }
      acc[goal].push(outcome);
      return acc;
    }, {});
  }, [outcomes]);

  // Memoize filtered outcomes
  const filteredOutcomes = useMemo(() => {
    return Object.entries(groupedOutcomes).reduce((acc: Record<string, any[]>, [goal, outcomes]) => {
      const filteredGoalOutcomes = outcomes.filter(
        outcome =>
          goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
          outcome.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredGoalOutcomes.length > 0 || goal.toLowerCase().includes(searchQuery.toLowerCase())) {
        acc[goal] = filteredGoalOutcomes;
      }
      return acc;
    }, {});
  }, [groupedOutcomes, searchQuery]);

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading outcomes</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (Object.keys(filteredOutcomes).length === 0) {
    return (
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
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(filteredOutcomes).map(([goal, outcomes]) => (
        <GoalCard
          key={goal}
          goal={goal}
          outcomes={outcomes}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddOutcome={onAddOutcome}
        />
      ))}
    </Accordion>
  );
};

export default OutcomesList;