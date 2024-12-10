import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { CompanyProvider } from "./contexts/CompanyContext";
import { AuthLayout } from "./layouts/AuthLayout";
import { AppLayout } from "./layouts/AppLayout";

// Lazy load the Login component
const Login = lazy(() => import("./pages/Login"));

// Configure QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (renamed from cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse space-y-4">
      <div className="h-12 w-12 bg-muted rounded-full mx-auto" />
      <div className="h-4 w-32 bg-muted rounded mx-auto" />
    </div>
  </div>
);

const AppContent = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        } 
      />
      <Route 
        path="/*" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AuthLayout>
              <AppLayout />
            </AuthLayout>
          </Suspense>
        } 
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CompanyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </CompanyProvider>
  </QueryClientProvider>
);

export default App;