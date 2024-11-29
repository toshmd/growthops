import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DbCompany } from "@/types/database";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Building2 } from "lucide-react";

interface CompanySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompanySelectionModal = ({ isOpen, onClose }: CompanySelectionModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies-selection'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          title: "Error loading companies",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data as DbCompany[];
    },
  });

  const handleCompanySelect = (companyId: string) => {
    navigate(`/advisor/companies?selected=${companyId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a Company</DialogTitle>
          <DialogDescription>
            Choose a company to manage its details and settings.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] mt-4">
          <div className="space-y-2 pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-20">
                <p className="text-sm text-muted-foreground">Loading companies...</p>
              </div>
            ) : companies?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-20 space-y-2">
                <Building2 className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No companies found</p>
              </div>
            ) : (
              companies?.map((company) => (
                <Button
                  key={company.id}
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => handleCompanySelect(company.id)}
                >
                  <span className="truncate">{company.name}</span>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CompanySelectionModal;