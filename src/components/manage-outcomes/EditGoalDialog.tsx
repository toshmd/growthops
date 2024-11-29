import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditGoalDialogProps {
  editingGoal: { id: string; name: string } | null;
  onClose: () => void;
  onSave: () => void;
  onNameChange: (name: string) => void;
}

const EditGoalDialog = ({
  editingGoal,
  onClose,
  onSave,
  onNameChange,
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
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditGoalDialog;