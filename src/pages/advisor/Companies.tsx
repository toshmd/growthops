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
  } = useInfiniteQuery({
    queryKey: ['companies'],
    queryFn: async ({ pageParam = 0 }) => {
      const from = (pageParam as number) * COMPANIES_PER_PAGE;
      const to = from + COMPANIES_PER_PAGE - 1;
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name')
        .range(from, to);
      
      if (error) throw error;
      return data || [];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length < COMPANIES_PER_PAGE ? undefined : pages.length;
    },
  });

  const companies = data?.pages?.flatMap(page => page) || [];

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