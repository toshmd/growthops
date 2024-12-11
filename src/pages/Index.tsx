import { useEffect, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  const queryClient = useQueryClient();
  
  const {
    outcomes,
    activityLogs,
    isLoadingOutcomes,
    isLoadingActivity,
    outcomesError,
    activityError
  } = useDashboardData(null);

  // Memoize date calculations
  const dates = useMemo(() => {
    const today = new Date();
    return {
      weekStart: startOfWeek(today),
      weekEnd: endOfWeek(today)
    };
  }, []);
  
  // Memoize mapped outcomes
  const mappedOutcomes = useMemo(() => 
    mapOutcomesToDueThisWeek(outcomes), [outcomes]
  );

  // Memoize filtered outcomes for this week
  const dueThisWeek = useMemo(() => 
    mappedOutcomes.filter(outcome => {
      const dueDate = parseISO(outcome.nextDue);
      return isWithinInterval(dueDate, { 
        start: dates.weekStart, 
        end: dates.weekEnd 
      });
    }), [mappedOutcomes, dates]
  );

  // Memoize stats calculation
  const stats = useMemo(() => 
    calculateDashboardStats(outcomes), [outcomes]
  );

  // Memoize completion data
  const completionData = useMemo(() => [
    { name: 'Completed', value: stats.completed },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Overdue', value: stats.overdue },
  ], [stats]);

  // Memoize subscription callback
  const handleOutcomesChange = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['outcomes'] });
  }, [queryClient]);

  const handleActivityChange = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['activity_logs'] });
  }, [queryClient]);

  // Subscribe to real-time updates
  useEffect(() => {
    const outcomeChannel = supabase
      .channel('outcomes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'outcomes'
        },
        handleOutcomesChange
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
        handleActivityChange
      )
      .subscribe();

    return () => {
      outcomeChannel.unsubscribe();
      activityChannel.unsubscribe();
    };
  }, [handleOutcomesChange, handleActivityChange]);

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