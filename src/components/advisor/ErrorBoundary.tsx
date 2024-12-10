import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  maxRetries?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0,
  };

  public static defaultProps = {
    maxRetries: 3,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for development
    console.error("Uncaught error:", error);
    console.error("Error info:", errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Log error to analytics/monitoring
    this.logErrorToAnalytics(error, errorInfo);
  }

  private logErrorToAnalytics(error: Error, errorInfo: ErrorInfo) {
    // Here we could integrate with various analytics services
    // For now, we'll just log to console in a structured way
    console.error({
      type: 'ERROR_BOUNDARY',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1,
    });
  };

  private canRetry = () => {
    return this.state.retryCount < (this.props.maxRetries || 3);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              {this.state.error?.message || "An unexpected error occurred"}
              {!this.canRetry() && (
                <p className="mt-2 text-sm">
                  Maximum retry attempts reached. Please refresh the page.
                </p>
              )}
            </AlertDescription>
          </Alert>
          {this.canRetry() ? (
            <Button onClick={this.handleReset} variant="outline">
              Try again ({this.props.maxRetries! - this.state.retryCount} attempts remaining)
            </Button>
          ) : (
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4"
            >
              Refresh page
            </Button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;