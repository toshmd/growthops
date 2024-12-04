import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdministratorModal from "@/components/advisor/AdministratorModal";
import { BecomeAdvisorCard } from "@/components/advisor/BecomeAdvisorCard";
import { AdministratorList } from "@/components/advisor/AdministratorList";
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

const Administrators = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: administrators = [], isLoading, error } = useQuery({
    queryKey: ['administrators'],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error('Not authenticated');

      // First check if the user is an advisor
      const { data: isAdvisorData, error: advisorError } = await supabase
        .rpc('is_user_advisor', {
          user_id: session.user.id
        });

      if (advisorError) throw advisorError;
      if (!isAdvisorData) {
        throw new Error('not_advisor');
      }

      const { data, error } = await supabase
        .from('people')
        .select(`
          id,
          user_id,
          is_advisor,
          role,
          company:company_id (
            name
          ),
          profiles:user_id (
            first_name,
            last_name,
            id
          )
        `)
        .eq('is_advisor', true);
      
      if (error) throw error;

      // Transform the data to match the Administrator type
      return (data || []).map(admin => ({
        id: admin.id,
        profiles: {
          first_name: admin.profiles?.first_name,
          last_name: admin.profiles?.last_name,
          email: admin.profiles?.id // Using id as email since that's what we get from auth
        },
        is_advisor: admin.is_advisor,
        role: admin.role,
        company: admin.company ? { name: admin.company.name } : undefined
      }));
    },
  });

  if (error) {
    if (error.message === 'not_advisor') {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Administrators</h1>
          <BecomeAdvisorCard />
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Error loading administrators</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!deleteAdminId) return;

    const { error: deleteError } = await supabase
      .from('people')
      .delete()
      .eq('id', deleteAdminId);

    if (deleteError) {
      toast({
        title: "Error",
        description: "Failed to delete administrator",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Administrator removed successfully",
      });
    }
    setDeleteAdminId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administrators</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Administrator
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Administrators</CardTitle>
          <CardDescription>Manage administrator access across all companies.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading administrators...</p>
          ) : administrators.length === 0 ? (
            <p className="text-sm text-muted-foreground">No administrators added yet.</p>
          ) : (
            <AdministratorList
              administrators={administrators}
              onEdit={(admin) => {
                setSelectedAdmin(admin);
                setIsModalOpen(true);
              }}
              onDelete={(id) => setDeleteAdminId(id)}
            />
          )}
        </CardContent>
      </Card>

      <AdministratorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAdmin(null);
        }}
        administrator={selectedAdmin}
      />

      <AlertDialog open={!!deleteAdminId} onOpenChange={() => setDeleteAdminId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove administrator access for this user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Administrators;