import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AdministratorFormFields } from "./AdministratorFormFields";
import { AdministratorRoleSelector } from "./AdministratorRoleSelector";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  isAdvisor: z.boolean().default(false),
});

export type AdministratorFormData = z.infer<typeof formSchema>;

interface AdministratorFormProps {
  onSubmit: (data: AdministratorFormData) => Promise<void>;
  onCancel: () => void;
  defaultValues?: AdministratorFormData;
  isLoading?: boolean;
}

export const AdministratorForm = ({
  onSubmit,
  onCancel,
  defaultValues,
  isLoading,
}: AdministratorFormProps) => {
  const form = useForm<AdministratorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      firstName: "",
      lastName: "",
      email: "",
      isAdvisor: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AdministratorFormFields control={form.control} />
        <AdministratorRoleSelector control={form.control} />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : defaultValues ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};