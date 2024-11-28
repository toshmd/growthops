import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProcessStatistics from "@/components/process/ProcessStatistics";
import { Card } from "@/components/ui/card";
import { AlertCircle, Clock, Activity } from "lucide-react";
import { Process } from "@/types/process";
import { format } from "date-fns";

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

// Mock activity data
const recentActivity = [
  {
    id: 1,
    action: "Process completed",
    process: "Weekly Review",
    user: "John Doe",
    timestamp: new Date(2024, 2, 10, 14, 30)
  },
  {
    id: 2,
    action: "New task added",
    process: "Monthly Report",
    user: "Jane Smith",
    timestamp: new Date(2024, 2, 9, 11, 15)
  },
  {
    id: 3,
    action: "Status updated",
    process: "Daily Standup",
    user: "Mike Johnson",
    timestamp: new Date(2024, 2, 8, 9, 45)
  }
];

const Index = () => {
  // Sort processes by next due date
  const upcomingDeadlines = [...mockProcesses]
    .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())
    .slice(0, 3);

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

        {/* Action Center */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity Feed */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 border-b border-gray-100 pb-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.process} - {activity.user}</p>
                    <p className="text-xs text-gray-500">
                      {format(activity.timestamp, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
            </div>
            <div className="space-y-4">
              {upcomingDeadlines.map((process) => (
                <div key={process.id} className="flex items-start gap-3 border-b border-gray-100 pb-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{process.title}</p>
                    <p className="text-sm text-gray-600">{process.description}</p>
                    <p className="text-xs text-gray-500">
                      Due: {format(new Date(process.nextDue), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              ))}
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