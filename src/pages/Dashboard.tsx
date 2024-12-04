import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Interval } from "@/utils/dateCalculations";
import ProcessCard from "@/components/dashboard/ProcessCard";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [intervalFilter, setIntervalFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const { toast } = useToast();

  const { data: outcomes = [], isLoading } = useQuery({
    queryKey: ['dashboard-outcomes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const query = supabase
        .from('outcomes')
        .select(`
          *,
          profiles!outcomes_created_by_fkey (
            first_name,
            last_name
          )
        `);

      if (intervalFilter !== "all") {
        query.eq('interval', intervalFilter);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error loading outcomes",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data?.map(outcome => ({
        id: outcome.id,
        title: outcome.title,
        owner: `${outcome.profiles?.first_name || ''} ${outcome.profiles?.last_name || ''}`.trim(),
        interval: outcome.interval as Interval,
        status: outcome.status,
        startDate: new Date(outcome.start_date),
        lastUpdated: outcome.updated_at,
        reportingDates: []
      })) || [];
    },
    enabled: true,
  });

  const filteredOutcomes = outcomes.filter(outcome => {
    if (ownerFilter === "all") return true;
    return outcome.owner.toLowerCase().includes(ownerFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leadership Dashboard</h1>
          <div className="flex gap-4">
            <Select
              value={intervalFilter}
              onValueChange={setIntervalFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intervals</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={ownerFilter}
              onValueChange={setOwnerFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                {[...new Set(outcomes.map(o => o.owner))]
                  .filter(Boolean)
                  .map(owner => (
                    <SelectItem key={owner} value={owner.toLowerCase()}>
                      {owner}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <Card className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ) : filteredOutcomes.length > 0 ? (
            filteredOutcomes.map((process) => (
              <ProcessCard key={process.id} process={process} />
            ))
          ) : (
            <Card className="p-6">
              <p className="text-center text-gray-500">No outcomes found</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;