import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DbCompany } from "@/types/database";

const COMPANIES_PER_PAGE = 10;

export const useCompanyQuery = () => {
  return useInfiniteQuery({
    queryKey: ['companies'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      // First check if user is advisor using RPC
      const { data: isAdvisor, error: advisorError } = await supabase
        .rpc('is_user_advisor', {
          user_id: user.id
        });

      if (advisorError) {
        throw advisorError;
      }

      if (!isAdvisor) {
        throw new Error('User is not an advisor');
      }

      // Then fetch companies in a separate query
      const from = pageParam * COMPANIES_PER_PAGE;
      
      const { data: companies, error, count } = await supabase
        .from('companies')
        .select('*', { count: 'exact' })
        .range(from, from + COMPANIES_PER_PAGE - 1)
        .order('name');

      if (error) {
        throw error;
      }

      return {
        companies: companies as DbCompany[],
        count: count || 0,
        nextPage: companies?.length === COMPANIES_PER_PAGE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageSize: COMPANIES_PER_PAGE,
  });
};