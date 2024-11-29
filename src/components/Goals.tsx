import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";

interface GoalsProps {
  selectedGoals: string[];
  onGoalsChange: (goals: string[]) => void;
  existingGoals?: string[];
}

const Goals = ({
  selectedGoals,
  onGoalsChange,
  existingGoals = [],
}: GoalsProps) => {
  const [newGoal, setNewGoal] = useState("");

  const handleAddGoal = () => {
    if (newGoal && !selectedGoals.includes(newGoal)) {
      onGoalsChange([...selectedGoals, newGoal]);
      setNewGoal("");
    }
  };

  const handleRemoveGoal = (goal: string) => {
    onGoalsChange(selectedGoals.filter((g) => g !== goal));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddGoal();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a goal"
          className="flex-1"
        />
        <Button onClick={handleAddGoal} type="button">
          Add
        </Button>
      </div>
      
      {existingGoals.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Suggested goals:</p>
          <div className="flex flex-wrap gap-2">
            {existingGoals
              .filter((goal) => !selectedGoals.includes(goal))
              .map((goal) => (
                <Badge
                  key={goal}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => onGoalsChange([...selectedGoals, goal])}
                >
                  {goal}
                </Badge>
              ))}
          </div>
        </div>
      )}

      {selectedGoals.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Selected goals:</p>
          <div className="flex flex-wrap gap-2">
            {selectedGoals.map((goal) => (
              <Badge
                key={goal}
                variant="secondary"
                className="pr-1.5"
              >
                {goal}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0.5 ml-1 hover:bg-transparent"
                  onClick={() => handleRemoveGoal(goal)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;