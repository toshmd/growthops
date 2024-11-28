import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Index from "./pages/Index";
import ManageOutcomes from "./pages/ManageOutcomes";
import MyOutcomes from "./pages/MyOutcomes";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative flex min-h-screen flex-col">
          <NavBar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/manage" element={<ManageOutcomes />} />
              <Route path="/my-outcomes" element={<MyOutcomes />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;