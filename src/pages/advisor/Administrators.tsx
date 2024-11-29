import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

  const { data: administrators = [], isLoading } = useQuery({
    queryKey: ['administrators'],
    queryFn: async () => {
      const { data, error } = await supabase
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
        .eq('is_advisor', true);
      
      if (error) throw error;
      return data || [];
    },
  });

  const handleDelete = async () => {
    if (deleteAdminId) {
      const { error } = await supabase
        .from('company_users')
        .delete()
        .eq('id', deleteAdminId);

      if (error) {
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
                      {admin.profiles?.first_name} {admin.profiles?.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {admin.profiles?.email}
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
                      size="sm"
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteAdminId(admin.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
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