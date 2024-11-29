import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/contexts/CompanyContext";
import { isWithinInterval, startOfWeek, endOfWeek } from "date-fns";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import CompletionChart from "@/components/dashboard/CompletionChart";
import DueThisWeek from "@/components/dashboard/DueThisWeek";
import StatusOverview from "@/components/dashboard/StatusOverview";
import TeamActivity from "@/components/dashboard/TeamActivity";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { selectedCompanyId } = useCompany();
  const { toast } = useToast();

  const { data: outcomes, isLoading: isLoadingOutcomes } = useQuery({
    queryKey: ['outcomes', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      const { data, error } = await supabase
        .from('outcomes')
        .select('*')
        .eq('company_id', selectedCompanyId);
      
      if (error) {
        toast({
          title: "Error loading outcomes",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    },
    enabled: !!selectedCompanyId,
  });

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  
  const dueThisWeek = outcomes?.filter(outcome => {
    const dueDate = new Date(outcome.next_due);
    return isWithinInterval(dueDate, { start: weekStart, end: weekEnd });
  }) || [];

  const stats = {
    total: outcomes?.length || 0,
    completed: outcomes?.filter(p => p.status === 'done').length || 0,
    inProgress: outcomes?.filter(p => p.status === 'incomplete').length || 0,
    overdue: outcomes?.filter(p => {
      const dueDate = new Date(p.next_due);
      return dueDate < today && p.status !== 'done';
    }).length || 0,
  };

  const completionData = [
    { name: 'Completed', value: stats.completed },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Overdue', value: stats.overdue },
  ];

  // Subscribe to real-time updates
  useEffect(() => {
    if (!selectedCompanyId) return;

    const subscription = supabase
      .channel('outcomes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'outcomes',
          filter: `company_id=eq.${selectedCompanyId}`,
        },
        () => {
          // Invalidate and refetch
          void queryClient.invalidateQueries({ queryKey: ['outcomes'] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedCompanyId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <WelcomeHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <CompletionChart 
            data={completionData} 
            isLoading={isLoadingOutcomes} 
          />
          <DueThisWeek 
            outcomes={dueThisWeek} 
            isLoading={isLoadingOutcomes} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeamActivity />
          <StatusOverview 
            stats={stats} 
            isLoading={isLoadingOutcomes} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;