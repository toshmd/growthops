import { Outcome } from "@/types/outcome";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Clock, CalendarDays } from "lucide-react";

interface OutcomeStatisticsProps {
  outcomes: Outcome[];
}

const OutcomeStatistics = ({ outcomes }: OutcomeStatisticsProps) => {
  const stats = {
    total: outcomes.length,
    completed: outcomes.filter(o => o.status === "done").length,
    overdue: outcomes.filter(o => {
      const nextDueDate = new Date(o.nextDue);
      return nextDueDate < new Date() && o.status !== "done";
    }).length,
    upcoming: outcomes.filter(o => {
      const nextDueDate = new Date(o.nextDue);
      const today = new Date();
      const inSevenDays = new Date();
      inSevenDays.setDate(today.getDate() + 7);
      return nextDueDate <= inSevenDays && nextDueDate >= today;
    }).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="p-4 flex items-center space-x-4 bg-white hover:shadow-md transition-shadow">
        <div className="p-3 rounded-full bg-blue-50">
          <CalendarDays className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Outcomes</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center space-x-4 bg-white hover:shadow-md transition-shadow">
        <div className="p-3 rounded-full bg-green-50">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-semibold">{stats.completed}</p>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center space-x-4 bg-white hover:shadow-md transition-shadow">
        <div className="p-3 rounded-full bg-red-50">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Overdue</p>
          <p className="text-2xl font-semibold">{stats.overdue}</p>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center space-x-4 bg-white hover:shadow-md transition-shadow">
        <div className="p-3 rounded-full bg-yellow-50">
          <Clock className="h-6 w-6 text-yellow-500" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Upcoming (7 days)</p>
          <p className="text-2xl font-semibold">{stats.upcoming}</p>
        </div>
      </Card>
    </div>
  );
};

export default OutcomeStatistics;
