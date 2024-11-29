import { Card } from "@/components/ui/card";
import TeamPerformanceMetrics from "./TeamPerformanceMetrics";
import OutcomeHealthMetrics from "./OutcomeHealthMetrics";

const MonthlyAnalytics = () => {
  return (
    <div className="grid gap-6">
      <TeamPerformanceMetrics />
      <OutcomeHealthMetrics />
    </div>
  );
};

export default MonthlyAnalytics;