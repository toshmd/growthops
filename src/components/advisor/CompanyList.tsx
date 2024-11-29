import { Company } from "@/types/company";
import CompanyActionButtons from "./CompanyActionButtons";
import { Skeleton } from "@/components/ui/skeleton";

interface CompanyListProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const CompanyList = ({ companies, onEdit, onDelete, isLoading }: CompanyListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No companies added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <div
          key={company.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div>
            <h3 className="font-medium">{company.name}</h3>
            {company.description && (
              <p className="text-sm text-muted-foreground">{company.description}</p>
            )}
          </div>
          <CompanyActionButtons
            company={company}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default CompanyList;