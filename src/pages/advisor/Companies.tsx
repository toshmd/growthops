import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBoundary } from "react-error-boundary";
import CompanyList from "@/components/advisor/CompanyList";
import CompanyListHeader from "@/components/advisor/CompanyListHeader";
import CompanyListErrorBoundary from "@/components/advisor/CompanyListErrorBoundary";
import CompanyError from "@/components/advisor/CompanyError";
import CompanyDialogs from "@/components/advisor/CompanyDialogs";
import { DbCompany } from "@/types/database";
import { useCompanyMutations } from "@/hooks/useCompanyMutations";
import { useCompanyQuery } from "@/hooks/useCompanyQuery";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  } = useCompanyQuery();

  const companies = data?.pages.flatMap(page => page.companies) || [];

  // Load pre-selected company
  useEffect(() => {
    if (selectedCompanyId) {
      const loadSelectedCompany = async () => {
        // First verify advisor status using RPC
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: isAdvisor, error: advisorError } = await supabase
          .rpc('is_user_advisor', {
            user_id: user.id
          });

        if (advisorError || !isAdvisor) {
          toast({
            title: "Error",
            description: "You don't have permission to view this company",
            variant: "destructive",
          });
          return;
        }

        // Then fetch company data
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
    return <CompanyError error={error} />;
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
      onReset={() => refetch()}
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

        <CompanyDialogs
          isModalOpen={isModalOpen}
          onCloseModal={() => {
            setIsModalOpen(false);
            setSelectedCompany(null);
          }}
          selectedCompany={selectedCompany}
          onSubmit={handleSubmit}
          deleteCompanyId={deleteCompanyId}
          onCloseDelete={() => setDeleteCompanyId(null)}
          onConfirmDelete={handleDelete}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Companies;