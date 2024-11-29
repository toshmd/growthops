import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { DbCompany } from "@/types/database";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompanyActionButtonsProps {
  company: DbCompany;
  onEdit: (company: DbCompany) => void;
  onDelete: (id: string) => void;
}

const CompanyActionButtons = ({ company, onEdit, onDelete }: CompanyActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(company)}
              aria-label={`Edit ${company.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit company</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(company.id)}
              aria-label={`Delete ${company.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete company</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CompanyActionButtons;