import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CompanyListHeaderProps {
  onNewCompany: () => void;
}

const CompanyListHeader = ({ onNewCompany }: CompanyListHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Companies</h1>
      <Button onClick={onNewCompany}>
        <Plus className="h-4 w-4 mr-2" />
        New Company
      </Button>
    </div>
  );
};

export default CompanyListHeader;