import { createContext, useContext, useState, ReactNode } from "react";
import { Company } from "@/types/company";

interface CompanyContextType {
  companies: Company[];
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string) => void;
  addCompany: (company: Company) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const addCompany = (company: Company) => {
    setCompanies((prev) => [...prev, company]);
    if (!selectedCompanyId) {
      setSelectedCompanyId(company.id);
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        selectedCompanyId,
        setSelectedCompanyId,
        addCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};