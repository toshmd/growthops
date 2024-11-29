import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  error: Error;
  resetErrorBoundary: () => void;
}

const CompanyListErrorBoundary = ({ error, resetErrorBoundary }: Props) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error loading companies</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{error.message}</p>
        <Button onClick={resetErrorBoundary} variant="outline" size="sm">
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default CompanyListErrorBoundary;