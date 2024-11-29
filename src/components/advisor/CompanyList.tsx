import { Company } from "@/types/company";
import { DbCompany } from "@/types/database";
import CompanyActionButtons from "./CompanyActionButtons";
import CompanyListSkeleton from "./CompanyListSkeleton";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface CompanyListProps {
  companies: DbCompany[];
  onEdit: (company: DbCompany) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

const CompanyList = ({ 
  companies, 
  onEdit, 
  onDelete, 
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage
}: CompanyListProps) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && fetchNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <CompanyListSkeleton />;
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
          role="article"
          aria-label={`Company: ${company.name}`}
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
      {(hasNextPage || isFetchingNextPage) && (
        <div ref={ref} className="py-4 text-center">
          <p className="text-sm text-muted-foreground">
            {isFetchingNextPage ? "Loading more..." : "Scroll to load more"}
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanyList;