import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import OutcomeFormFields, { formSchema } from "@/components/outcome/OutcomeFormFields";
import * as z from "zod";

interface CreateProcessProps {
  selectedYear?: string;
  onSuccess?: () => void;
}

const CreateProcess = ({ selectedYear, onSuccess }: CreateProcessProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      owner: "",
      goals: [],
      startDate: new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Include the selected year from the parent component
    const outcomeWithYear = {
      ...values,
      year: selectedYear ? parseInt(selectedYear) : new Date().getFullYear(),
    };
    
    console.log(outcomeWithYear);
    toast({
      title: "Process Created",
      description: "The new process has been successfully created.",
    });
    form.reset();
    onSuccess?.();
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
          <Button type="submit" className="w-full">
            Create Process
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateProcess;