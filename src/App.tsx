import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompanyProvider } from "./contexts/CompanyContext";
import NavBar from "./components/NavBar";
import TopMenu from "./components/TopMenu";
import Index from "./pages/Index";
import ManageOutcomes from "./pages/ManageOutcomes";
import MyOutcomes from "./pages/MyOutcomes";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import Teams from "./pages/Teams";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CompanyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative flex min-h-screen">
            <NavBar />
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
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </CompanyProvider>
  </QueryClientProvider>
);

export default App;