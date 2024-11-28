import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - in a real app this would come from a backend
const mockProcesses = [
  {
    id: 1,
    title: "Weekly Team Meeting Minutes",
    owner: "John Doe",
    interval: "weekly",
    status: "done",
    lastUpdated: "2024-03-01",
  },
  {
    id: 2,
    title: "Monthly Financial Report",
    owner: "Jane Smith",
    interval: "monthly",
    status: "blocked",
    lastUpdated: "2024-02-28",
  },
  {
    id: 3,
    title: "Quarterly Strategy Review",
    owner: "Mike Johnson",
    interval: "quarterly",
    status: "incomplete",
    lastUpdated: "2024-02-15",
  },
];

const Dashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-success text-success-foreground";
      case "blocked":
        return "bg-destructive text-destructive-foreground";
      case "incomplete":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

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

        <div className="grid grid-cols-1 gap-4">
          {mockProcesses.map((process) => (
            <Card key={process.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{process.title}</h2>
                  <p className="text-sm text-gray-600">Owner: {process.owner}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{process.interval}</Badge>
                  <Badge className={getStatusColor(process.status)}>
                    {process.status.charAt(0).toUpperCase() + process.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {process.lastUpdated}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;