import { Accordion } from "@/components/ui/accordion";
import { useMemo } from "react";
import GoalCard from "./GoalCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface OutcomesListProps {
  groupedOutcomes: Record<string, any[]>;
  searchQuery: string;
  onEdit: (goal: string) => void;
  onDelete: (goal: string) => void;
  onAddOutcome: (goal: string) => void;
}

const OutcomesList = ({ 
  groupedOutcomes, 
  searchQuery, 
  onEdit, 
  onDelete, 
  onAddOutcome 
}: OutcomesListProps) => {
  // Memoize filtered outcomes to prevent unnecessary recalculations
  const filteredOutcomes = useMemo(() => {
    return Object.entries(groupedOutcomes).reduce((acc, [goal, outcomes]) => {
      const filteredGoalOutcomes = outcomes.filter(
        outcome =>
          goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
          outcome.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredGoalOutcomes.length > 0 || goal.toLowerCase().includes(searchQuery.toLowerCase())) {
        acc[goal] = filteredGoalOutcomes;
      }
      return acc;
    }, {} as Record<string, typeof outcomes>);
  }, [groupedOutcomes, searchQuery]);

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