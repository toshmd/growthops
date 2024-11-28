import { format, isPast, isWeekend } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Outcome, ReportingDateStatus } from "@/types/outcome";
import { calculateFutureReportingDates } from "@/utils/dateCalculations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReportingDateCard from "../process/ReportingDateCard";
import { ChevronRight } from "lucide-react";

interface OutcomeReportingDatesProps {
  outcome: Outcome;
  onUpdateReportingDate: (outcomeId: number, date: Date) => void;
}

const OutcomeReportingDates = ({ outcome, onUpdateReportingDate }: OutcomeReportingDatesProps) => {
  const getDateStatus = (date: Date) => {
    return outcome.reportingDates?.find(
      (rd) => rd.date.getTime() === date.getTime()
    );
  };

  const getStatusColor = (date: Date, status?: string) => {
    if (isPast(date) && status !== "completed") return "bg-destructive/10 border-destructive";
    if (status === "completed") return "bg-success/10 border-success";
    if (isWeekend(date)) return "bg-gray-50 border-gray-200";
    return "bg-white border-gray-200";
  };

  const dates = calculateFutureReportingDates(outcome.startDate, outcome.interval);

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="future-dates" className="border-none">
        <AccordionTrigger className="text-lg font-medium hover:no-underline">
          <div className="flex items-center gap-2">
            Future Reporting Dates
            <ChevronRight className="h-4 w-4 transition-transform duration-200" />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="relative mt-6">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            
            <div className="space-y-6">
              {dates.map((date, index) => {
                const dateStatus = getDateStatus(date);
                return (
                  <div key={index} className="relative pl-12">
                    <div className={`absolute left-3 w-3 h-3 rounded-full -translate-x-1.5 ${
                      dateStatus?.status === "completed" ? "bg-success" : 
                      isPast(date) ? "bg-destructive" : "bg-gray-300"
                    }`} />
                    
                    <ReportingDateCard
                      date={date}
                      status={dateStatus}
                      statusColor={getStatusColor(date, dateStatus?.status)}
                      onUpdate={() => onUpdateReportingDate(outcome.id, date)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default OutcomeReportingDates;