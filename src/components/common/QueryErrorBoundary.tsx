import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface QueryErrorBoundaryProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

const QueryErrorBoundary = ({ error, resetErrorBoundary }: QueryErrorBoundaryProps) => {
  if (!error) return null;

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Data</AlertTitle>
        <AlertDescription className="mt-2">
          {error.message || "An unexpected error occurred"}
        </AlertDescription>
      </Alert>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try Again
      </Button>
    </div>
  );
};

export default QueryErrorBoundary;