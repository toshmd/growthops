import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/contexts/CompanyContext";
import { isWithinInterval, startOfWeek, endOfWeek, parseISO, isPast } from "date-fns";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import CompletionChart from "@/components/dashboard/CompletionChart";
import DueThisWeek from "@/components/dashboard/DueThisWeek";
import StatusOverview from "@/components/dashboard/StatusOverview";
import TeamActivity from "@/components/dashboard/TeamActivity";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Outcome } from "@/types/outcome";

type Profile = {
  first_name: string | null;
  last_name: string | null;
};

type OutcomeWithProfile = Database['public']['Tables']['outcomes']['Row'] & {
  profiles: Profile;
};

type ActivityLogWithProfile = Database['public']['Tables']['activity_logs']['Row'] & {
  profiles: Profile;
};

const Index = () => {
  const { selectedCompanyId } = useCompany();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch outcomes with proper error handling and typing
  const { data: outcomes, isLoading: isLoadingOutcomes, error: outcomesError } = useQuery({
    queryKey: ['outcomes', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('outcomes')
        .select(`
          *,
          profiles:created_by (
            first_name,
            last_name
          )
        `)
        .eq('company_id', selectedCompanyId);
      
      if (error) {
        console.error('Error fetching outcomes:', error);
        throw error;
      }
      
      return (data || []).map(outcome => ({
        ...outcome,
        profiles: outcome.profiles || { first_name: null, last_name: null }
      })) as OutcomeWithProfile[];
    },
    enabled: !!selectedCompanyId,
  });

  // Fetch activity logs with proper error handling and typing
  const { data: activityLogs, isLoading: isLoadingActivity, error: activityError } = useQuery({
    queryKey: ['activity_logs', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .eq('entity_type', 'outcome')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching activity:', error);
        throw error;
      }

      return (data || []).map(log => ({
        ...log,
        profiles: log.profiles || { first_name: null, last_name: null }
      })) as ActivityLogWithProfile[];
    },
    enabled: !!selectedCompanyId,
  });

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  
  const dueThisWeek = outcomes?.map(outcome => ({
    id: parseInt(outcome.id),
    title: outcome.title,
    description: outcome.description || '',
    interval: outcome.interval as Outcome['interval'],
    nextDue: outcome.next_due,
    status: outcome.status || 'pending',
    startDate: new Date(outcome.start_date),
    teamId: outcome.team_id,
    reportingDates: [],
  })).filter(outcome => {
    const dueDate = parseISO(outcome.nextDue);
    return isWithinInterval(dueDate, { start: weekStart, end: weekEnd });
  }) || [];

  const stats = {
    total: outcomes?.length || 0,
    completed: outcomes?.filter(p => p.status === 'completed').length || 0,
    inProgress: outcomes?.filter(p => p.status === 'in_progress').length || 0,
    overdue: outcomes?.filter(p => {
      const dueDate = parseISO(p.next_due);
      return isPast(dueDate) && p.status !== 'completed';
    }).length || 0,
  };

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