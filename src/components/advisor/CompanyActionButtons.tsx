import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Company } from "@/types/company";

interface CompanyActionButtonsProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

const CompanyActionButtons = ({ company, onEdit, onDelete }: CompanyActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(company)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(company.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CompanyActionButtons;