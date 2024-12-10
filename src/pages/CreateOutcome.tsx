import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OutcomeFormFields, { formSchema } from "@/components/outcome/OutcomeFormFields";
import * as z from "zod";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface CreateProcessProps {
  selectedYear?: string;
  onSuccess?: () => void;
}

const CreateProcess = ({ selectedYear, onSuccess }: CreateProcessProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create outcomes.",
          variant: "destructive",
        });
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  // Fetch existing goals (outcomes without parent_outcome_id)
  const { data: existingGoals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outcomes')
        .select('title')
        .is('parent_outcome_id', null);
      
      if (error) {
        console.error("Error fetching goals:", error);
        toast({
          title: "Error",
          description: "Failed to fetch existing goals. Please try again.",
          variant: "destructive",
        });
        return [];
      }
      return data.map(outcome => outcome.title.split(':')[0] || outcome.title);
    },
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
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
              created_by: session.user.id,
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
    onError: (error: Error) => {
      console.error("Error creating process:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create process. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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