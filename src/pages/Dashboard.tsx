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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database } from "@/integrations/supabase/types";
import { useDashboardData } from "@/hooks/useDashboardData";

type OutcomeWithProfile = Database['public']['Tables']['outcomes']['Row'] & {
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
};

const Dashboard = () => {
  const [intervalFilter, setIntervalFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const { toast } = useToast();

  const { outcomes = [], isLoadingOutcomes, outcomesError } = useDashboardData(null);

  if (outcomesError) {
    console.error('Dashboard error:', outcomesError);
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {outcomesError.message || "Failed to load the dashboard. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const filteredOutcomes = outcomes.filter(outcome => {
    if (ownerFilter === "all") return true;
    const ownerName = outcome.profiles ? 
      `${outcome.profiles.first_name || ''} ${outcome.profiles.last_name || ''}`.trim().toLowerCase() : 
      '';
    return ownerName.includes(ownerFilter.toLowerCase());
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
                {[...new Set(outcomes.map(o => 
                  o.profiles ? 
                    `${o.profiles.first_name || ''} ${o.profiles.last_name || ''}`.trim() : 
                    ''
                ))]
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
          {isLoadingOutcomes ? (
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