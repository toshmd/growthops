import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Company } from "@/types/company";

interface CompanyListProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const CompanyList = ({ companies, onEdit, onDelete, isLoading }: CompanyListProps) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading companies...</p>;
  }

  if (companies.length === 0) {
    return <p className="text-sm text-muted-foreground">No companies added yet.</p>;
  }

  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <div
          key={company.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <h3 className="font-medium">{company.name}</h3>
            {company.description && (
              <p className="text-sm text-muted-foreground">{company.description}</p>
            )}
          </div>
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
        </div>
      ))}
    </div>
  );
};

export default CompanyList;