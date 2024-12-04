import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Profile = {
  first_name: string | null;
  last_name: string | null;
};

export type OutcomeWithProfile = Database['public']['Tables']['outcomes']['Row'] & {
  profiles: Profile;
};

export type ActivityLogWithProfile = Database['public']['Tables']['activity_logs']['Row'] & {
  profiles: Profile;
};

export const useDashboardData = (selectedCompanyId: string | null) => {
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

  return {
    outcomes,
    activityLogs,
    isLoadingOutcomes,
    isLoadingActivity,
    outcomesError,
    activityError
  };
};