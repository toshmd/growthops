import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ErrorBoundary } from "react-error-boundary";
import CompanyModal from "@/components/company/CompanyModal";
import CompanyList from "@/components/advisor/CompanyList";
import CompanyListHeader from "@/components/advisor/CompanyListHeader";
import CompanyListErrorBoundary from "@/components/advisor/CompanyListErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { DbCompany } from "@/types/database";
import { useCompanyMutations } from "@/hooks/useCompanyMutations";
import { useToast } from "@/components/ui/use-toast";

const COMPANIES_PER_PAGE = 10;

interface CompaniesResponse {
  companies: DbCompany[];
  count: number;
}

const Companies = () => {
  const [searchParams] = useSearchParams();
  const selectedCompanyId = searchParams.get('selected');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<DbCompany | null>(null);
  const [deleteCompanyId, setDeleteCompanyId] = useState<string | null>(null);
  const { toast } = useToast();
  const { createCompanyMutation, updateCompanyMutation, deleteCompanyMutation } = useCompanyMutations();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch
  } = useInfiniteQuery<CompaniesResponse, Error>({
    queryKey: ['companies'],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * COMPANIES_PER_PAGE;
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

  const companies = data?.pages.flatMap(page => page.companies) || [];

  // Load pre-selected company
  useEffect(() => {
    if (selectedCompanyId) {
      const loadSelectedCompany = async () => {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', selectedCompanyId)
          .single();
        
        if (error) {
          toast({
            title: "Error loading company",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          setSelectedCompany(data);
          setIsModalOpen(true);
        }
      };

      loadSelectedCompany();
    }
  }, [selectedCompanyId, toast]);

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Error loading companies</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: { name: string; description?: string }) => {
    if (selectedCompany) {
      await updateCompanyMutation.mutateAsync({ id: selectedCompany.id, data });
    } else {
      await createCompanyMutation.mutateAsync(data);
    }
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  const handleDelete = async () => {
    if (deleteCompanyId) {
      await deleteCompanyMutation.mutateAsync(deleteCompanyId);
      setDeleteCompanyId(null);
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={CompanyListErrorBoundary}
      onReset={refetch}
    >
      <div className="space-y-6">
        <CompanyListHeader onNewCompany={() => setIsModalOpen(true)} />

        <Card>
          <CardHeader>
            <CardTitle>All Companies</CardTitle>
            <CardDescription>
              Manage and monitor all companies under your advisory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyList
              companies={companies}
              isLoading={isLoading}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              onEdit={(company) => {
                setSelectedCompany(company);
                setIsModalOpen(true);
              }}
              onDelete={(id) => setDeleteCompanyId(id)}
            />
          </CardContent>
        </Card>

        <CompanyModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCompany(null);
          }}
          company={selectedCompany || undefined}
          onSubmit={handleSubmit}
        />

        <AlertDialog open={!!deleteCompanyId} onOpenChange={() => setDeleteCompanyId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the company
                and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ErrorBoundary>
  );
};

export default Companies;