import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DbCompany } from "@/types/database";
import { useToast } from "@/components/ui/use-toast";

interface CompaniesResponse {
  companies: DbCompany[];
  count: number;
}

const COMPANIES_PER_PAGE = 10;

export const useCompanyQuery = () => {
  const { toast } = useToast();

  return useInfiniteQuery<CompaniesResponse, Error>({
    queryKey: ['companies'],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const from = Number(pageParam) * COMPANIES_PER_PAGE;
      const to = from + COMPANIES_PER_PAGE - 1;

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Direct query to check advisor status
      const { data: advisorData, error: advisorError } = await supabase
        .from('people')
        .select('is_advisor')
        .eq('user_id', user.id)
        .maybeSingle();

      if (advisorError) {
        throw advisorError;
      }

      if (!advisorData?.is_advisor) {
        throw new Error('User is not an advisor');
      }
      
      // Fetch companies if user is verified as advisor
      const { data, error, count } = await supabase
        .from('companies')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('name');
      
      if (error) {
        toast({
          title: "Error fetching companies",
          description: error.message,
          variant: "destructive",
        });
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