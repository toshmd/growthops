import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Administrator {
  id: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  is_advisor?: boolean;
  role?: string;
  company?: {
    name: string;
  };
}

interface AdministratorListProps {
  administrators: Administrator[];
  onEdit: (admin: Administrator) => void;
  onDelete: (id: string) => void;
}

export const AdministratorList = ({ administrators, onEdit, onDelete }: AdministratorListProps) => {
  return (
    <div className="space-y-4">
      {administrators.map((admin) => (
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
              onClick={() => onEdit(admin)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(admin.id)}
              className="text-red-500 hover:text-red-600"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};