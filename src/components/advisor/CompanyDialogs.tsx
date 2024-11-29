import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import CompanyModal from "@/components/company/CompanyModal";
import { DbCompany } from "@/types/database";

interface CompanyDialogsProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  selectedCompany: DbCompany | null;
  onSubmit: (data: { name: string; description?: string }) => Promise<void>;
  deleteCompanyId: string | null;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
}

const CompanyDialogs = ({
  isModalOpen,
  onCloseModal,
  selectedCompany,
  onSubmit,
  deleteCompanyId,
  onCloseDelete,
  onConfirmDelete
}: CompanyDialogsProps) => (
  <>
    <CompanyModal
      isOpen={isModalOpen}
      onClose={onCloseModal}
      company={selectedCompany || undefined}
      onSubmit={onSubmit}
    />

    <AlertDialog open={!!deleteCompanyId} onOpenChange={onCloseDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the company
            and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
);

export default CompanyDialogs;