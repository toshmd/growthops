import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProcessStatistics from "@/components/process/ProcessStatistics";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Process } from "@/types/process";

// Mock data for demonstration - in a real app, this would come from your backend
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  title: "Process Manager"
};

const mockProcesses: Process[] = [
  { 
    id: 1, 
    title: "Monthly Report", 
    description: "Generate and submit monthly performance report",
    interval: "monthly",
    status: "pending", 
    nextDue: "2024-03-15", 
    startDate: new Date() 
  },
  { 
    id: 2, 
    title: "Weekly Review", 
    description: "Team progress review meeting",
    interval: "weekly",
    status: "done", 
    nextDue: "2024-03-10", 
    startDate: new Date() 
  },
  { 
    id: 3, 
    title: "Daily Standup", 
    description: "Daily team sync meeting",
    interval: "daily",
    status: "pending", 
    nextDue: "2024-03-01", 
    startDate: new Date() 
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {mockUser.firstName}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {mockUser.title}
          </p>
        </div>

        {/* Process Statistics */}
        <ProcessStatistics processes={mockProcesses} />

        {/* Overdue Items Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Requires Attention</h2>
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">2 overdue processes require your attention</span>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-x-4">
          <Button asChild>
            <Link to="/manage">Manage Processes</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/my-processes">My Processes</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">Leadership Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;