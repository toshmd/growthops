import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Interval } from "@/utils/dateCalculations";
import ProcessCard from "@/components/dashboard/ProcessCard";

const Dashboard = () => {
  const mockProcesses = [
    {
      id: 1,
      title: "Weekly Team Meeting Minutes",
      owner: "John Doe",
      interval: "weekly" as Interval,
      status: "done",
      lastUpdated: "2024-03-01",
      startDate: new Date("2024-03-01"),
      reportingDates: [
        {
          date: "2024-03-01",
          status: "completed",
          notes: "Team alignment achieved\nAction items assigned\nNext steps defined",
        }
      ]
    },
    {
      id: 2,
      title: "Monthly Financial Report",
      owner: "Jane Smith",
      interval: "monthly" as Interval,
      status: "blocked",
      lastUpdated: "2024-02-28",
      startDate: new Date("2024-02-01"),
      reportingDates: [
        {
          date: "2024-02-01",
          status: "completed",
          notes: "Budget review completed\nExpense tracking updated",
        }
      ]
    },
    {
      id: 3,
      title: "Quarterly Strategy Review",
      owner: "Mike Johnson",
      interval: "quarterly" as Interval,
      status: "incomplete",
      lastUpdated: "2024-02-15",
      startDate: new Date("2024-01-01"),
      reportingDates: [
        {
          date: "2024-01-01",
          status: "completed",
          notes: "Q1 goals set\nResource allocation planned",
        }
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leadership Dashboard</h1>
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Intervals</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {mockProcesses.map((process) => (
            <ProcessCard key={process.id} process={process} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;