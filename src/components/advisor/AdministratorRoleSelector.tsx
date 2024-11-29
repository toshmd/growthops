import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { AdministratorFormData } from "./AdministratorForm";

interface AdministratorRoleSelectorProps {
  control: Control<AdministratorFormData>;
}

export const AdministratorRoleSelector = ({ control }: AdministratorRoleSelectorProps) => {
  return (
    <FormField
      control={control}
      name="isAdvisor"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>Advisor Access</FormLabel>
            <FormDescription>
              Grant access to the advisor portal and management capabilities
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
};