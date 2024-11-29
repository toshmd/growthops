import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ManageOutcomesHeaderProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ManageOutcomesHeader = ({
  selectedYear,
  onYearChange,
  searchQuery,
  onSearchChange,
}: ManageOutcomesHeaderProps) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Outcomes</h1>
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search goals and outcomes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default ManageOutcomesHeader;