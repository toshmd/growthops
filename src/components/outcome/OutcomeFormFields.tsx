import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Goals from "@/components/Goals";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

export const intervals = [
  "daily",
  "weekly",
  "biweekly",
  "monthly",
  "quarterly",
  "biannual",
  "annual",
] as const;

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  interval: z.enum(intervals, {
    required_error: "Please select an interval",
  }),
  owner: z.string().min(1, "Owner is required"),
  goals: z.array(z.string()),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  year: z.number().min(2000).max(2100),
});

type FormData = z.infer<typeof formSchema>;

interface OutcomeFormFieldsProps {
  form: UseFormReturn<FormData>;
  existingGoals: string[];
}

const OutcomeFormFields = ({ form, existingGoals }: OutcomeFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Process Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter process title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter process description"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="interval"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Interval</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {intervals.map((interval) => (
                  <SelectItem key={interval} value={interval}>
                    {interval.charAt(0).toUpperCase() + interval.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="owner"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Process Owner</FormLabel>
            <FormControl>
              <Input placeholder="Enter owner name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(parseInt(value))}
              defaultValue={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="goals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Goals</FormLabel>
            <FormControl>
              <Goals
                selectedGoals={field.value}
                onGoalsChange={field.onChange}
                existingGoals={existingGoals}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default OutcomeFormFields;
