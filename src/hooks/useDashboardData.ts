import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

type Profile = {
  first_name: string | null;
  last_name: string | null;
};

type ActivityLogDetails = {
  outcome_title?: string;
  previous_owner?: string;
  new_owner?: string;
};

export type OutcomeWithProfile = Database["public"]["Tables"]["outcomes"]["Row"] & {
  created_by_profile: Profile;
};

export type ActivityLogWithProfile = Database["public"]["Tables"]["activity_logs"]["Row"] & {
  user: Profile;
  details: ActivityLogDetails;
};

export const useDashboardData = (selectedCompanyId: string | null) => {
  const { toast } = useToast();

  const { data: outcomes = [], isLoading: isLoadingOutcomes, error: outcomesError } = useQuery({
    queryKey: ['dashboard-outcomes', selectedCompanyId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      if (!selectedCompanyId) {
        return [];
      }

      const { data, error } = await supabase
        .from('outcomes')
        .select(`
          *,
          created_by_profile:profiles!outcomes_created_by_fkey (
            first_name,
            last_name
          )
        `)
        .eq('team_id', selectedCompanyId)
        .returns<(Database["public"]["Tables"]["outcomes"]["Row"] & {
          created_by_profile: Profile;
        })[]>();

      if (error) {
        console.error('Error fetching outcomes:', error);
        throw error;
      }

      return data.map(outcome => ({
        ...outcome,
        created_by_profile: outcome.created_by_profile || { first_name: null, last_name: null }
      }));
    },
    meta: {
      errorMessage: "Failed to load outcomes"
    }
  });

  const { data: activityLogs = [], isLoading: isLoadingActivity, error: activityError } = useQuery({
    queryKey: ['activity_logs', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          user:profiles!activity_logs_user_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('entity_type', 'outcome')
        .order('created_at', { ascending: false })
        .limit(10)
        .returns<(Database["public"]["Tables"]["activity_logs"]["Row"] & {
          user: Profile;
          details: ActivityLogDetails;
        })[]>();

      if (error) {
        console.error('Error fetching activity:', error);
        throw error;
      }

      return data.map(log => ({
        ...log,
        user: log.user || { first_name: null, last_name: null },
        details: log.details as ActivityLogDetails
      }));
    },
    enabled: !!selectedCompanyId,
    meta: {
      errorMessage: "Failed to load activity logs"
    }
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