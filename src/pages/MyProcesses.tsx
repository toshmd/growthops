import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Process } from "@/types/process";
import ProcessCard from "@/components/process/ProcessCard";

// Mock data - in a real app this would come from an API
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

const MyProcesses = () => {
  const [processes, setProcesses] = useState(mockProcesses);
  const { toast } = useToast();

  const handleUpdateReportingDate = (processId: number, date: Date) => {
    setProcesses((currentProcesses) =>
      currentProcesses.map((process) => {
        if (process.id === processId) {
          const updatedReportingDates = [
            ...(process.reportingDates || []),
            {
              date,
              status: "pending" as const,
              notes: "",
              updatedBy: "Current User",
              updatedAt: new Date(),
              actionItems: [],
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
  };

  const handleUpdateStatus = (processId: number, status: string, notes: string) => {
    setProcesses((currentProcesses) =>
      currentProcesses.map((process) =>
        process.id === processId
          ? { ...process, status, notes }
          : process
      )
    );

    toast({
      title: "Process Updated",
      description: "The process status has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">My Processes</h1>
        <div className="space-y-6">
          {processes.map((process) => (
            <ProcessCard
              key={process.id}
              process={process}
              onUpdateStatus={handleUpdateStatus}
              onUpdateReportingDate={handleUpdateReportingDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProcesses;