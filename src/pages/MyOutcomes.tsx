import { useToast } from "@/components/ui/use-toast";
import { Outcome } from "@/types/outcome";
import OutcomeCard from "@/components/outcome/OutcomeCard";
import OutcomeStatistics from "@/components/outcome/OutcomeStatistics";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/contexts/CompanyContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { CreateOutcomeDialog } from "@/components/outcome/CreateOutcomeDialog";

const MyOutcomes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedCompanyId } = useCompany();

  // Fetch outcomes from Supabase
  const { data: outcomes, isLoading } = useQuery({
    queryKey: ['my-outcomes', selectedCompanyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outcomes')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .order('next_due', { ascending: true });

      if (error) {
        toast({
          title: "Error loading outcomes",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Map the Supabase response to our Outcome type
      return (data || []).map(outcome => ({
        id: parseInt(outcome.id),
        title: outcome.title,
        description: outcome.description || '',
        interval: outcome.interval as Outcome['interval'],
        nextDue: outcome.next_due,
        status: outcome.status || 'pending',
        startDate: new Date(outcome.start_date),
        teamId: outcome.team_id,
        reportingDates: [],
      }));
    },
    enabled: !!selectedCompanyId,
  });

  // Update outcome status mutation
  const updateOutcomeMutation = useMutation({
    mutationFn: async ({ outcomeId, status, notes }: { outcomeId: number, status: string, notes: string }) => {
      const { error } = await supabase
        .from('outcomes')
        .update({ 
          status,
          description: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', outcomeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-outcomes'] });
      toast({
        title: "Status Updated",
        description: "The outcome status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update outcome status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update reporting date mutation
  const updateReportingDateMutation = useMutation({
    mutationFn: async ({ outcomeId, date }: { outcomeId: number, date: Date }) => {
      const { error } = await supabase
        .from('outcomes')
        .update({ 
          next_due: date.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', outcomeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-outcomes'] });
      toast({
        title: "Date Updated",
        description: "The reporting date has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update reporting date. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateStatus = (outcomeId: number, status: string, notes: string) => {
    updateOutcomeMutation.mutate({ outcomeId, status, notes });
  };

  const handleUpdateReportingDate = (outcomeId: number, date: Date) => {
    updateReportingDateMutation.mutate({ outcomeId, date });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">My Outcomes</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const EmptyState = () => (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No outcomes yet</h3>
        <p className="text-muted-foreground mb-6">
          Start tracking your progress by creating your first outcome. Define what success looks like and measure it consistently.
        </p>
        <CreateOutcomeDialog />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Outcomes</h1>
          <CreateOutcomeDialog />
        </div>
        {outcomes && outcomes.length > 0 ? (
          <>
            <OutcomeStatistics outcomes={outcomes} />
            <div className="space-y-6">
              {outcomes.map((outcome) => (
                <OutcomeCard
                  key={outcome.id}
                  outcome={outcome}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdateReportingDate={handleUpdateReportingDate}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default MyOutcomes;
