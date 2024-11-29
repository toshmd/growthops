import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface NavErrorProps {
  error: string;
}

export const NavError = ({ error }: NavErrorProps) => (
  <nav className="fixed left-0 top-0 h-screen w-64 border-r bg-sidebar-background">
    <div className="flex h-full flex-col py-4 px-3">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="mt-2 text-sm">
          {error}
        </AlertDescription>
      </Alert>
    </div>
  </nav>
);