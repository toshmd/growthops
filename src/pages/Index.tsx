import { Link } from "react-router-dom";
import { AlertCircle, Clock, Activity, PieChart, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import OutcomeStatistics from "@/components/outcome/OutcomeStatistics";
import TeamActivity from "@/components/dashboard/TeamActivity";
import { Outcome } from "@/types/outcome";
import { format, isWithinInterval, startOfWeek, endOfWeek } from "date-fns";
import { PieChart as ReChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const mockUser = {
  firstName: "John",
  lastName: "Doe",
  title: "Outcome Manager"
};

const mockOutcomes: Outcome[] = [
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
    action: "Outcome completed",
    outcome: "Weekly Review",
    user: "John Doe",
    timestamp: new Date(2024, 2, 10, 14, 30)
  },
  {
    id: 2,
    action: "New task added",
    outcome: "Monthly Report",
    user: "Jane Smith",
    timestamp: new Date(2024, 2, 9, 11, 15)
  },
  {
    id: 3,
    action: "Status updated",
    outcome: "Daily Standup",
    user: "Mike Johnson",
    timestamp: new Date(2024, 2, 8, 9, 45)
  }
];

const Index = () => {
  const upcomingDeadlines = [...mockOutcomes]
    .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())
    .slice(0, 3);

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  
  const dueThisWeek = mockOutcomes.filter(outcome => {
    const dueDate = new Date(outcome.nextDue);
    return isWithinInterval(dueDate, { start: weekStart, end: weekEnd });
  });

  const completionData = [
    { name: 'Completed', value: mockOutcomes.filter(p => p.status === 'done').length },
    { name: 'In Progress', value: mockOutcomes.filter(p => p.status === 'incomplete').length },
    { name: 'Overdue', value: mockOutcomes.filter(p => {
      const dueDate = new Date(p.nextDue);
      return dueDate < today && p.status !== 'done';
    }).length },
  ];

  const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {mockUser.firstName}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {mockUser.title}
          </p>
        </div>

        <OutcomeStatistics outcomes={mockOutcomes} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 p-6">
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

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Due This Week</h3>
            </div>
            <div className="space-y-3">
              {dueThisWeek.map((outcome) => (
                <div key={outcome.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <p className="font-medium text-gray-900">{outcome.title}</p>
                    <p className="text-xs text-gray-500">
                      Due: {format(new Date(outcome.nextDue), "MMM d")}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    outcome.status === 'done' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {outcome.status === 'done' ? 'Complete' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeamActivity />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Status Overview</h2>
            </div>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Outcomes</span>
                  <span className="font-semibold">{mockOutcomes.length}</span>
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
      </div>
    </div>
  );
};

export default Index;
