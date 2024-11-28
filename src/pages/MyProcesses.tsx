import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format, isPast, isWeekend } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { calculateFutureReportingDates } from "@/utils/dateCalculations";
import { Process, ReportingDateStatus } from "@/types/process";

// Mock data - in a real app this would come from a backend
const mockProcesses: Process[] = [
  {
    id: 1,
    title: "Weekly Team Meeting Minutes",
    description: "Document and distribute team meeting minutes",
    interval: "weekly",
    nextDue: "2024-03-10",
    status: "incomplete",
    startDate: new Date("2024-03-01"),
    reportingDates: [],
  },
  {
    id: 2,
    title: "Monthly Financial Report",
    description: "Prepare and submit monthly financial summary",
    interval: "monthly",
    nextDue: "2024-03-31",
    status: "done",
    startDate: new Date("2024-01-01"),
    reportingDates: [],
  },
];

const getStatusColor = (date: Date, status?: string) => {
  if (isPast(date) && status !== "completed") return "bg-red-50 border-red-200";
  if (status === "completed") return "bg-green-50 border-green-200";
  if (isWeekend(date)) return "bg-gray-50 border-gray-200";
  return "bg-white border-gray-200";
};

const MyProcesses = () => {
  const [processes, setProcesses] = useState(mockProcesses);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleUpdateReportingDate = (processId: number, date: Date) => {
    setProcesses((currentProcesses) =>
      currentProcesses.map((process) => {
        if (process.id === processId) {
          const updatedReportingDates = [
            ...(process.reportingDates || []),
            {
              date,
              status: selectedStatus as ReportingDateStatus["status"],
              notes,
              updatedBy: "Current User", // In a real app, this would come from auth
              updatedAt: new Date(),
            },
          ];
          return {
            ...process,
            reportingDates: updatedReportingDates,
          };
        }
        return process;
      })
    );

    toast({
      title: "Status Updated",
      description: "The reporting date status has been updated successfully.",
    });

    setSelectedStatus("");
    setNotes("");
  };

  const getDateStatus = (process: Process, date: Date) => {
    return process.reportingDates?.find(
      (rd) => rd.date.getTime() === date.getTime()
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <h1 className="text-2xl font-bold mb-6">My Processes</h1>
        <div className="space-y-6">
          {processes.map((process) => (
            <Card key={process.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{process.title}</h2>
                  <p className="text-gray-600 mt-1">{process.description}</p>
                </div>
                <Badge
                  variant={process.status === "done" ? "default" : "secondary"}
                >
                  {process.interval}
                </Badge>
              </div>

              <Accordion type="single" collapsible className="w-full mb-4">
                <AccordionItem value="future-dates">
                  <AccordionTrigger>Future Reporting Dates</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {calculateFutureReportingDates(
                        process.startDate,
                        process.interval
                      ).map((date, index) => {
                        const dateStatus = getDateStatus(process, date);
                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border ${getStatusColor(
                              date,
                              dateStatus?.status
                            )}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  {format(date, "PPP")}
                                </p>
                                {dateStatus && (
                                  <div className="mt-2 text-sm text-gray-600">
                                    <p>
                                      Status:{" "}
                                      <Badge
                                        variant={
                                          dateStatus.status === "completed"
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {dateStatus.status}
                                      </Badge>
                                    </p>
                                    {dateStatus.notes && (
                                      <p className="mt-1">
                                        Notes: {dateStatus.notes}
                                      </p>
                                    )}
                                    <p className="mt-1 text-xs">
                                      Updated by {dateStatus.updatedBy} on{" "}
                                      {format(
                                        dateStatus.updatedAt || new Date(),
                                        "PPp"
                                      )}
                                    </p>
                                  </div>
                                )}
                              </div>
                              {!dateStatus && (
                                <div className="space-y-2 w-full max-w-md">
                                  <Select
                                    value={selectedStatus}
                                    onValueChange={setSelectedStatus}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">
                                        Pending
                                      </SelectItem>
                                      <SelectItem value="completed">
                                        Completed
                                      </SelectItem>
                                      <SelectItem value="overdue">
                                        Overdue
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add notes..."
                                    className="h-20"
                                  />
                                  <Button
                                    onClick={() =>
                                      handleUpdateReportingDate(process.id, date)
                                    }
                                    disabled={!selectedStatus}
                                  >
                                    Update Status
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status Update</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="incomplete">Incomplete</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any relevant notes..."
                      className="h-20"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={() => handleUpdateStatus(process.id)}
                  className="mt-4"
                >
                  Update Status
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProcesses;