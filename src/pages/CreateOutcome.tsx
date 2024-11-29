import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import OutcomeFormFields, { formSchema } from "@/components/outcome/OutcomeFormFields";
import * as z from "zod";

const CreateProcess = () => {
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
    console.log(values);
    toast({
      title: "Process Created",
      description: "The new process has been successfully created.",
    });
    form.reset();
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