import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdministratorForm, AdministratorFormData } from "./AdministratorForm";

interface AdministratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  administrator?: any;
}

const AdministratorModal = ({ isOpen, onClose, administrator }: AdministratorModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createAdminMutation = useMutation({
    mutationFn: async (data: AdministratorFormData) => {
      // First create or update the profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: crypto.randomUUID(),
          first_name: data.firstName,
          last_name: data.lastName,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Then create the company_user entry
      const { error: companyUserError } = await supabase
        .from('company_users')
        .insert({
          user_id: profile.id,
          is_advisor: data.isAdvisor,
          role: 'advisor',
        });

      if (companyUserError) throw companyUserError;

      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['administrators'] });
      toast({
        title: "Success",
        description: "Administrator created successfully",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create administrator",
        variant: "destructive",
      });
    },
    retry: 3,
  });

  const defaultValues = administrator
    ? {
        firstName: administrator.profiles.first_name,
        lastName: administrator.profiles.last_name,
        email: administrator.profiles.email,
        isAdvisor: administrator.is_advisor,
      }
    : undefined;

  const handleSubmit = async (data: AdministratorFormData) => {
    await createAdminMutation.mutateAsync(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {administrator ? "Edit Administrator" : "Create Administrator"}
          </DialogTitle>
        </DialogHeader>
        <AdministratorForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          defaultValues={defaultValues}
          isLoading={createAdminMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdministratorModal;