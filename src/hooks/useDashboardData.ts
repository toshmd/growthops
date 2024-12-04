import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const { data: outcomes = [], isLoading: isLoadingOutcomes, error: outcomesError } = useQuery({
    queryKey: ['dashboard-outcomes', selectedCompanyId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // First, get the user's company_id if not provided
      let companyId = selectedCompanyId;
      if (!companyId) {
        const { data: peopleData } = await supabase
          .from('people')
          .select('company_id')
          .eq('user_id', user.id)
          .single();
        
        companyId = peopleData?.company_id;
      }

      if (!companyId) {
        return [];
      }

      // Fetch outcomes with a simplified query
      const { data, error } = await supabase
        .from('outcomes')
        .select(`
          *,
          created_by_profile:profiles!outcomes_created_by_fkey (
            first_name,
            last_name
          )
        `)
        .eq('company_id', companyId);

      if (error) {
        console.error('Error fetching outcomes:', error);
        toast({
          title: "Error loading outcomes",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data?.map(outcome => ({
        ...outcome,
        owner: outcome.created_by_profile ? 
          `${outcome.created_by_profile.first_name || ''} ${outcome.created_by_profile.last_name || ''}`.trim() : 
          'Unknown',
        interval: outcome.interval,
        status: outcome.status,
        startDate: new Date(outcome.start_date),
        lastUpdated: outcome.updated_at,
        reportingDates: []
      })) || [];
    },
    enabled: true,
    retry: 1,
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
        .limit(10);

      if (error) {
        console.error('Error fetching activity:', error);
        toast({
          title: "Error loading activity",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return (data || []).map(log => ({
        ...log,
        profiles: log.user || { first_name: null, last_name: null }
      })) as ActivityLogWithProfile[];
    },
    enabled: !!selectedCompanyId
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