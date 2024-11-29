import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { CompanyProvider } from "./contexts/CompanyContext";
import NavBar from "./components/NavBar";
import AdvisorNavBar from "./components/advisor/AdvisorNavBar";
import TopMenu from "./components/TopMenu";
import Index from "./pages/Index";
import ManageOutcomes from "./pages/ManageOutcomes";
import MyOutcomes from "./pages/MyOutcomes";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import Teams from "./pages/Teams";
import Analytics from "./pages/Analytics";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import Companies from "./pages/advisor/Companies";
import Administrators from "./pages/advisor/Administrators";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppLayout = () => {
  const location = useLocation();
  const isAdvisorRoute = location.pathname.startsWith('/advisor');

  return (
    <div className="relative flex min-h-screen">
      {isAdvisorRoute ? <AdvisorNavBar /> : <NavBar />}
      <div className="flex-1 pl-64">
        <TopMenu />
        <main className="container mx-auto py-6 mt-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/manage" element={<ManageOutcomes />} />
            <Route path="/my-outcomes" element={<MyOutcomes />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/advisor" element={<AdvisorDashboard />} />
            <Route path="/advisor/companies" element={<Companies />} />
            <Route path="/advisor/administrators" element={<Administrators />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
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