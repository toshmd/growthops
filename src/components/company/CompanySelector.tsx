import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Company } from "@/types/company";

interface CompanySelectorProps {
  companies: Company[];
  selectedCompanyId: string | null;
  onCompanyChange: (companyId: string) => void;
}

const CompanySelector = ({ companies, selectedCompanyId, onCompanyChange }: CompanySelectorProps) => {
  return (
    <Select value={selectedCompanyId || undefined} onValueChange={onCompanyChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select company" />
      </SelectTrigger>
      <SelectContent>
        {companies.map((company) => (
          <SelectItem key={company.id} value={company.id}>
            {company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CompanySelector;