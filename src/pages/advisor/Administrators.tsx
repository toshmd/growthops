import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import AdministratorModal from "@/components/advisor/AdministratorModal";
import { supabase } from "@/integrations/supabase/client";
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
  const queryClient = useQueryClient();

  const { data: administrators = [], isLoading } = useQuery({
    queryKey: ['administrators'],
    queryFn: async () => {
      const { data: companyUsers, error } = await supabase
        .from('company_users')
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
            email
          )
        `)
        .or('is_advisor.eq.true,role.eq.admin');
      
      if (error) throw error;
      return companyUsers;
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('company_users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['administrators'] });
      toast({
        title: "Success",
        description: "Administrator removed successfully",
      });
    },
  });

  const handleDelete = async () => {
    if (deleteAdminId) {
      await deleteAdminMutation.mutateAsync(deleteAdminId);
      setDeleteAdminId(null);
    }
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
            <div className="space-y-4">
              {administrators.map((admin: any) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">
                      {admin.profiles.first_name} {admin.profiles.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {admin.profiles.email}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {admin.is_advisor && (
                        <Badge variant="secondary">Advisor</Badge>
                      )}
                      {admin.role === 'admin' && (
                        <Badge variant="secondary">Company Admin</Badge>
                      )}
                      {admin.company && (
                        <Badge variant="outline">{admin.company.name}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedAdmin(admin)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteAdminId(admin.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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