import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle, Clock, Activity, PieChart, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import ProcessStatistics from "@/components/process/ProcessStatistics";
import { Process } from "@/types/process";
import { format, isWithinInterval, startOfWeek, endOfWeek } from "date-fns";
import { PieChart as ReChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

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

  // Calculate processes due this week
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  
  const dueThisWeek = mockProcesses.filter(process => {
    const dueDate = new Date(process.nextDue);
    return isWithinInterval(dueDate, { start: weekStart, end: weekEnd });
  });

  // Calculate completion rates for pie chart
  const completionData = [
    { name: 'Completed', value: mockProcesses.filter(p => p.status === 'done').length },
    { name: 'In Progress', value: mockProcesses.filter(p => p.status === 'incomplete').length },
    { name: 'Overdue', value: mockProcesses.filter(p => {
      const dueDate = new Date(p.nextDue);
      return dueDate < today && p.status !== 'done';
    }).length },
  ];

  const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

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

        {/* Process Summary Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Process Summary</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Completion Rates */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Completion Rates</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Legend />
                  </ReChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Processes Due This Week */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Due This Week</h3>
              </div>
              <div className="space-y-3">
                {dueThisWeek.map((process) => (
                  <div key={process.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div>
                      <p className="font-medium text-gray-900">{process.title}</p>
                      <p className="text-xs text-gray-500">
                        Due: {format(new Date(process.nextDue), "MMM d")}
                      </p>
                    </div>
                    {process.status === 'done' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Status Overview */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Status Overview</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Processes</span>
                  <span className="font-semibold">{mockProcesses.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="text-green-600 font-semibold">
                    {completionData[0].value}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">In Progress</span>
                  <span className="text-yellow-600 font-semibold">
                    {completionData[1].value}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Overdue</span>
                  <span className="text-red-600 font-semibold">
                    {completionData[2].value}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};

export default Index;
