import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface EditGoalDialogProps {
  editingGoal: { id: string; name: string } | null;
  onClose: () => void;
  onSave: () => void;
  onNameChange: (name: string) => void;
  isLoading?: boolean;
}

const EditGoalDialog = ({
  editingGoal,
  onClose,
  onSave,
  onNameChange,
  isLoading,
}: EditGoalDialogProps) => {
  if (!editingGoal) return null;

  return (
    <Dialog open={!!editingGoal} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
        </DialogHeader>
        <Input
          value={editingGoal.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="mt-4"
          disabled={isLoading}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditGoalDialog;