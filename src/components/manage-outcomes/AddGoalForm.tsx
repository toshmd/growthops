import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";

interface AddGoalFormProps {
  newGoal: string;
  onNewGoalChange: (value: string) => void;
  onAddGoal: () => void;
  isLoading?: boolean;
}

const AddGoalForm = ({ newGoal, onNewGoalChange, onAddGoal, isLoading }: AddGoalFormProps) => {
  return (
    <div className="mb-8">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Enter new goal"
          value={newGoal}
          onChange={(e) => onNewGoalChange(e.target.value)}
          className="max-w-xs"
          disabled={isLoading}
        />
        <Button 
          onClick={onAddGoal} 
          className="bg-success hover:bg-success/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Add Goal
        </Button>
      </div>
    </div>
  );
};

export default AddGoalForm;