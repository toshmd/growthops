import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieChartIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CompletionChartProps {
  data: Array<{ name: string; value: number }>;
  isLoading?: boolean;
}

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

const CompletionChart = ({ data, isLoading }: CompletionChartProps) => {
  if (isLoading) {
    return (
      <Card className="lg:col-span-2 p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Completion Rates</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
      </Card>
    );
  }

  if (!data.length) {
    return (
      <Card className="lg:col-span-2 p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Completion Rates</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 p-6">
      <div className="flex items-center gap-2 mb-4">
        <PieChartIcon className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Completion Rates</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default CompletionChart;