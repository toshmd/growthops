import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/contexts/CompanyContext";
import OutcomeFormFields, { formSchema } from "@/components/outcome/OutcomeFormFields";
import * as z from "zod";

interface CreateProcessProps {
  selectedYear?: string;
  onSuccess?: () => void;
}

const CreateProcess = ({ selectedYear, onSuccess }: CreateProcessProps) => {
  const { toast } = useToast();
  const { selectedCompanyId } = useCompany();
  
  // Fetch existing goals (outcomes without parent_outcome_id)
  const { data: existingGoals = [] } = useQuery({
    queryKey: ['goals', selectedCompanyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outcomes')
        .select('title')
        .eq('company_id', selectedCompanyId)
        .is('parent_outcome_id', null);
      
      if (error) throw error;
      // Extract just the goal names from the titles
      return data.map(outcome => outcome.title.split(':')[0] || outcome.title);
    },
    enabled: !!selectedCompanyId,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      owner: "",
      goals: [],
      startDate: new Date(),
      interval: "monthly",
    },
  });

  const createOutcomeMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!selectedCompanyId) {
        throw new Error("No company selected");
      }

      // For each selected goal, create an outcome
      const promises = values.goals.map(async (goal) => {
        const { data, error } = await supabase
          .from('outcomes')
          .insert([
            {
              title: `${goal}: ${values.title}`,
              description: values.description,
              interval: values.interval,
              start_date: values.startDate.toISOString(),
              next_due: values.startDate.toISOString(),
              company_id: selectedCompanyId,
            }
          ])
          .select()
          .single();

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        return data;
      });

      return Promise.all(promises);
    },
    onSuccess: () => {
      toast({
        title: "Process Created",
        description: "The new process has been successfully created.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create process. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating process:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!selectedCompanyId) {
      toast({
        title: "Error",
        description: "Please select a company first.",
        variant: "destructive",
      });
      return;
    }
    createOutcomeMutation.mutate(values);
  };

  return (
    <div className="py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <OutcomeFormFields form={form} existingGoals={existingGoals} />
          <Button 
            type="submit" 
            className="w-full"
            disabled={createOutcomeMutation.isPending}
          >
            {createOutcomeMutation.isPending ? "Creating..." : "Create Process"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateProcess;