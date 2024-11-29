import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
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
              parent_outcome_id: null,
            }
          ])
          .select()
          .single();

        if (error) throw error;
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
    createOutcomeMutation.mutate(values);
  };

  const existingGoals = [
    "Revenue Growth",
    "Customer Satisfaction",
    "Operational Efficiency",
    "Employee Development",
    "Innovation"
  ];

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