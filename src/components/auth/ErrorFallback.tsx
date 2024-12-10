import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { sanitizeInput } from "@/utils/sanitization";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback = ({ error }: ErrorFallbackProps) => (
  <div 
    className="min-h-screen flex items-center justify-center bg-background"
    role="alert"
    aria-labelledby="error-title"
  >
    <Alert variant="destructive" className="max-w-md">
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      <AlertTitle id="error-title">Authentication Error</AlertTitle>
      <AlertDescription>{sanitizeInput(error.message)}</AlertDescription>
    </Alert>
  </div>
);