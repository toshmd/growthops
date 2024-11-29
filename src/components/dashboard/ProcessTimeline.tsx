import { calculateFutureReportingDates } from "@/utils/dateCalculations";
import { format, isPast } from "date-fns";
import { DateCard } from "./DateCard";

interface ProcessTimelineProps {
  process: any;
}

const ProcessTimeline = ({ process }: ProcessTimelineProps) => {
  return (
    <div className="relative mt-6">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
      <div className="space-y-6">
        {calculateFutureReportingDates(process.startDate, process.interval).map((date, index) => (
          <div key={index} className="relative pl-12">
            <div className={`absolute left-3 w-3 h-3 rounded-full -translate-x-1.5 ${
              process.status === "done" ? "bg-success" : 
              isPast(date) ? "bg-destructive" : "bg-gray-300"
            }`} />
            <DateCard
              date={date}
              process={process}
              status={process.status}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessTimeline;