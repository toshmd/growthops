import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/contexts/CompanyContext";
import { isWithinInterval, startOfWeek, endOfWeek, parseISO } from "date-fns";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import CompletionChart from "@/components/dashboard/CompletionChart";
import DueThisWeek from "@/components/dashboard/DueThisWeek";
import StatusOverview from "@/components/dashboard/StatusOverview";
import TeamActivity from "@/components/dashboard/TeamActivity";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { calculateDashboardStats, mapOutcomesToDueThisWeek } from "@/components/dashboard/DashboardStats";

const Index = () => {
  const { selectedCompanyId } = useCompany();
  const queryClient = useQueryClient();
  
  const {
    outcomes,
    activityLogs,
    isLoadingOutcomes,
    isLoadingActivity,
    outcomesError,
    activityError
  } = useDashboardData(selectedCompanyId);

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  
  const mappedOutcomes = mapOutcomesToDueThisWeek(outcomes);
  const dueThisWeek = mappedOutcomes.filter(outcome => {
    const dueDate = parseISO(outcome.nextDue);
    return isWithinInterval(dueDate, { start: weekStart, end: weekEnd });
  });

  const stats = calculateDashboardStats(outcomes);

  const completionData = [
    { name: 'Completed', value: stats.completed },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Overdue', value: stats.overdue },
  ];

  // Subscribe to real-time updates
  useEffect(() => {
    if (!selectedCompanyId) return;

    const outcomeChannel = supabase
      .channel('outcomes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'outcomes',
          filter: `company_id=eq.${selectedCompanyId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['outcomes'] });
        }
      )
      .subscribe();

    const activityChannel = supabase
      .channel('activity_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_logs',
          filter: `entity_type=eq.outcome`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['activity_logs'] });
        }
      )
      .subscribe();

    return () => {
      outcomeChannel.unsubscribe();
      activityChannel.unsubscribe();
    };
  }, [selectedCompanyId, queryClient]);

  if (outcomesError || activityError) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {outcomesError ? 'Error loading outcomes' : 'Error loading activity logs'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <WelcomeHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <CompletionChart 
            data={completionData} 
            isLoading={isLoadingOutcomes} 
          />
          <DueThisWeek 
            outcomes={dueThisWeek} 
            isLoading={isLoadingOutcomes} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeamActivity 
            activityLogs={activityLogs || []} 
            isLoading={isLoadingActivity} 
          />
          <StatusOverview 
            stats={stats} 
            isLoading={isLoadingOutcomes} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;