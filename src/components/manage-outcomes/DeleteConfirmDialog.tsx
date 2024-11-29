import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  showDeleteConfirm: { type: "goal" | "outcome"; id: string } | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog = ({
  showDeleteConfirm,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) => {
  if (!showDeleteConfirm) return null;

  return (
    <Dialog open={!!showDeleteConfirm} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {showDeleteConfirm.type}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;