import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import TopMenu from "@/components/TopMenu";
import ManageOutcomes from "@/pages/ManageOutcomes";
import MyOutcomes from "@/pages/MyOutcomes";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import Users from "@/pages/Users";
import Teams from "@/pages/Teams";
import Analytics from "@/pages/Analytics";
import AdvisorDashboard from "@/pages/AdvisorDashboard";
import Companies from "@/pages/advisor/Companies";
import Administrators from "@/pages/advisor/Administrators";
import Settings from "@/pages/Settings";

export const AppLayout = () => {
  return (
    <div className="relative flex min-h-screen">
      <NavBar />
      <div className="flex-1 pl-64">
        <TopMenu />
        <main className="container mx-auto py-6 mt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/manage" element={<ManageOutcomes />} />
            <Route path="/my-outcomes" element={<MyOutcomes />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/advisor" element={<AdvisorDashboard />} />
            <Route path="/advisor/companies" element={<Companies />} />
            <Route path="/advisor/administrators" element={<Administrators />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};