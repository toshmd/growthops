import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export const useOutcomesData = (selectedYear: string, selectedCompanyId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Validate year
  const isValidYear = /^\d{4}$/.test(selectedYear) && 
    parseInt(selectedYear) >= 1900 && 
    parseInt(selectedYear) <= new Date().getFullYear() + 10;

  if (!isValidYear) {
    console.error("Invalid year:", selectedYear);
    throw new Error("Invalid year selected");
  }

  const { data: outcomes = [], isLoading, error } = useQuery({
    queryKey: ['outcomes', selectedYear, selectedCompanyId],
    queryFn: async () => {
      console.log('Fetching outcomes for year:', selectedYear, 'and company:', selectedCompanyId);
      
      if (!selectedCompanyId) {
        throw new Error("No company selected");
      }

      const { data, error } = await supabase
        .from('outcomes')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .gte('start_date', `${selectedYear}-01-01`)
        .lte('start_date', `${selectedYear}-12-31`);
      
      if (error) {
        console.error('Error fetching outcomes:', error);
        throw error;
      }
      
      console.log('Fetched outcomes:', data);
      return data;
    },
    enabled: !!selectedCompanyId && isValidYear,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      errorMessage: "Failed to load outcomes"
    }
  });

  // Add outcome mutation
  const addOutcomeMutation = useMutation({
    mutationFn: async (title: string) => {
      console.log('Adding outcome:', title);
      
      if (!selectedCompanyId) {
        throw new Error("No company selected");
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from('outcomes')
        .insert([
          {
            title,
            company_id: selectedCompanyId,
            interval: 'monthly',
            start_date: new Date().toISOString(),
            next_due: new Date().toISOString(),
            description: '',
            created_by: session.session.user.id
          }
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outcomes'] });
      toast({
        title: "Success",
        description: "Outcome added successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Error adding outcome:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add outcome. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update outcome mutation
  const updateOutcomeMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      console.log('Updating outcome:', id, title);
      
      const { error } = await supabase
        .from('outcomes')
        .update({ title })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outcomes'] });
      toast({
        title: "Success",
        description: "Outcome updated successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Error updating outcome:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update outcome. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete outcome mutation
  const deleteOutcomeMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting outcome:', id);
      
      const { error } = await supabase
        .from('outcomes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outcomes'] });
      toast({
        title: "Success",
        description: "Outcome deleted successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting outcome:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete outcome. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      queryClient.cancelQueries({ queryKey: ['outcomes', selectedYear, selectedCompanyId] });
    };
  }, [queryClient, selectedYear, selectedCompanyId]);

  return {
    outcomes,
    isLoading,
    error,
    addOutcomeMutation,
    updateOutcomeMutation,
    deleteOutcomeMutation
  };
};