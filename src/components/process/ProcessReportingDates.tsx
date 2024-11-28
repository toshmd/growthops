import { format, isPast, isWeekend } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Process, ReportingDateStatus } from "@/types/process";
import { calculateFutureReportingDates } from "@/utils/dateCalculations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReportingDateCard from "./ReportingDateCard";

interface ProcessReportingDatesProps {
  process: Process;
  onUpdateReportingDate: (processId: number, date: Date) => void;
}

const ProcessReportingDates = ({ process, onUpdateReportingDate }: ProcessReportingDatesProps) => {
  const getDateStatus = (date: Date) => {
    return process.reportingDates?.find(
      (rd) => rd.date.getTime() === date.getTime()
    );
  };

  const getStatusColor = (date: Date, status?: string) => {
    if (isPast(date) && status !== "completed") return "bg-red-50 border-red-200";
    if (status === "completed") return "bg-green-50 border-green-200";
    if (isWeekend(date)) return "bg-gray-50 border-gray-200";
    return "bg-white border-gray-200";
  };

  return (
    <Accordion type="single" collapsible className="w-full mb-4">
      <AccordionItem value="future-dates">
        <AccordionTrigger className="text-lg font-medium">
          Future Reporting Dates
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {calculateFutureReportingDates(process.startDate, process.interval)
              .map((date, index) => {
                const dateStatus = getDateStatus(date);
                return (
                  <ReportingDateCard
                    key={index}
                    date={date}
                    status={dateStatus}
                    statusColor={getStatusColor(date, dateStatus?.status)}
                    onUpdate={() => onUpdateReportingDate(process.id, date)}
                  />
                );
              })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProcessReportingDates;