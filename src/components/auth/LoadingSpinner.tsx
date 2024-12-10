import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => (
  <div 
    className="min-h-screen flex items-center justify-center bg-background"
    role="status"
    aria-label="Loading authentication"
  >
    <div className="flex flex-col items-center space-y-4">
      <Loader2 
        className="h-8 w-8 animate-spin text-primary" 
        aria-hidden="true"
      />
      <p className="text-sm text-muted-foreground">
        Checking authentication...
      </p>
    </div>
  </div>
);