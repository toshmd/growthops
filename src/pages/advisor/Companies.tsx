import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
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
import CompanyModal from "@/components/company/CompanyModal";
import CompanyList from "@/components/advisor/CompanyList";
import CompanyListHeader from "@/components/advisor/CompanyListHeader";
import ErrorBoundary from "@/components/advisor/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const COMPANIES_PER_PAGE = 10;

const Companies = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [deleteCompanyId, setDeleteCompanyId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Company[]>({
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
      return data as Company[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length < COMPANIES_PER_PAGE ? undefined : pages.length;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const companies = (data?.pages.flat() || []) as Company[];

  const createCompanyMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const { error } = await supabase
        .from('companies')
        .insert([data]);
      
      if (error) throw error;
    },
    onMutate: async (newCompany) => {
      await queryClient.cancelQueries({ queryKey: ['companies'] });
      const previousCompanies = queryClient.getQueryData(['companies']);
      
      queryClient.setQueryData(['companies'], (old: any) => ({
        pages: [
          [{ id: 'temp-id', ...newCompany, created_at: new Date().toISOString() }],
          ...(old?.pages || []),
        ],
      }));

      return { previousCompanies };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['companies'], context?.previousCompanies);
      toast({
        title: "Error",
        description: "Failed to create company. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "Success",
        description: "Company created successfully",
      });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; description?: string } }) => {
      const { error } = await supabase
        .from('companies')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['companies'] });
      const previousCompanies = queryClient.getQueryData(['companies']);
      
      queryClient.setQueryData(['companies'], (old: any) => ({
        pages: old.pages.map((page: Company[]) =>
          page.map((company) =>
            company.id === id ? { ...company, ...data } : company
          )
        ),
      }));

      return { previousCompanies };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['companies'], context?.previousCompanies);
      toast({
        title: "Error",
        description: "Failed to update company. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "Success",
        description: "Company updated successfully",
      });
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['companies'] });
      const previousCompanies = queryClient.getQueryData(['companies']);
      
      queryClient.setQueryData(['companies'], (old: any) => ({
        pages: old.pages.map((page: Company[]) =>
          page.filter((company) => company.id !== deletedId)
        ),
      }));

      return { previousCompanies };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['companies'], context?.previousCompanies);
      toast({
        title: "Error",
        description: "Failed to delete company. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
    },
  });

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
    <ErrorBoundary>
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
              onEdit={(company) => {
                setSelectedCompany(company);
                setIsModalOpen(true);
              }}
              onDelete={(id) => setDeleteCompanyId(id)}
            />
            {!isLoading && hasNextPage && (
              <div ref={ref} className="py-4">
                {isFetchingNextPage ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Loading more companies...
                  </p>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    Scroll to load more
                  </p>
                )}
              </div>
            )}
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
