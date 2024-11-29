import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/contexts/CompanyContext";
import CreateOutcome from "@/pages/CreateOutcome";

export function CreateOutcomeDialog() {
  const [open, setOpen] = useState(false);
  const { selectedCompanyId } = useCompany();
  
  // Fetch existing goals (outcomes without parent_outcome_id)
  const { data: goals } = useQuery({
    queryKey: ['goals', selectedCompanyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outcomes')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .is('parent_outcome_id', null);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCompanyId,
  });

  // Only show dialog if there are existing goals
  if (!goals?.length) {
    return (
      <Button asChild variant="outline">
        <a href="/manage" className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Goal First
        </a>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Outcome
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Outcome</DialogTitle>
        </DialogHeader>
        <CreateOutcome onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}