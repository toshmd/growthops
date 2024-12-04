import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const BecomeAdvisorCard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const becomeAdvisorMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('people')
        .update({ is_advisor: true })
        .eq('user_id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['administrators'] });
      toast({
        title: "Success",
        description: "You are now an advisor",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Become an Advisor</CardTitle>
        <CardDescription>
          You need advisor privileges to manage administrators.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={() => becomeAdvisorMutation.mutate()}
          disabled={becomeAdvisorMutation.isPending}
        >
          {becomeAdvisorMutation.isPending ? "Processing..." : "Become an Advisor"}
        </Button>
      </CardContent>
    </Card>
  );
};