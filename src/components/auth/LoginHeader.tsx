import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LoginHeaderProps {
  authError: string | null;
}

export const LoginHeader = ({ authError }: LoginHeaderProps) => (
  <div className="mb-8">
    <h1 className="text-2xl font-bold text-center" id="login-title">Welcome Back</h1>
    <p className="text-center text-muted-foreground mt-2" id="login-description">
      Please sign in to continue to your dashboard
    </p>
    {authError && (
      <Alert variant="destructive" className="mt-4" role="alert" aria-labelledby="error-title">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        <AlertTitle id="error-title">Authentication Error</AlertTitle>
        <AlertDescription>{authError}</AlertDescription>
      </Alert>
    )}
  </div>
);