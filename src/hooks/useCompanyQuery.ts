import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DbCompany } from "@/types/database";

interface CompaniesResponse {
  companies: DbCompany[];
  count: number;
}

const COMPANIES_PER_PAGE = 10;

export const useCompanyQuery = () => {
  return useInfiniteQuery<CompaniesResponse, Error>({
    queryKey: ['companies'],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const from = Number(pageParam) * COMPANIES_PER_PAGE;
      const to = from + COMPANIES_PER_PAGE - 1;

      // First check if the user is an advisor
      const { data: userData, error: userError } = await supabase
        .from('company_users')
        .select('is_advisor')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (userError) {
        throw new Error('Failed to verify advisor status');
      }

      if (!userData?.is_advisor) {
        throw new Error('User is not an advisor');
      }
      
      const { data, error, count } = await supabase
        .from('companies')
        .select('*', { count: 'exact' })
        .range(from, to);
      
      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }
      
      return {
        companies: data as DbCompany[],
        count: count || 0
      };
    },
    getNextPageParam: (lastPage, pages) => {
      const totalItems = lastPage.count;
      const currentItems = pages.reduce((acc, page) => acc + page.companies.length, 0);
      return currentItems < totalItems ? pages.length : undefined;
    },
  });
};