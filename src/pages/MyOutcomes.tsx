import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Outcome } from "@/types/outcome";
import OutcomeCard from "@/components/outcome/OutcomeCard";
import OutcomeStatistics from "@/components/outcome/OutcomeStatistics";

// Mock data - in a real app this would come from an API
const mockOutcomes: Outcome[] = [
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

const MyOutcomes = () => {
  const [outcomes, setOutcomes] = useState(mockOutcomes);
  const { toast } = useToast();

  const handleUpdateReportingDate = (outcomeId: number, date: Date) => {
    setOutcomes((currentOutcomes) =>
      currentOutcomes.map((outcome) => {
        if (outcome.id === outcomeId) {
          const updatedReportingDates = [
            ...(outcome.reportingDates || []),
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
            ...outcome,
            reportingDates: updatedReportingDates,
          };
        }
        return outcome;
      })
    );

    toast({
      title: "Status Updated",
      description: "The reporting date status has been updated successfully.",
    });
  };

  const handleUpdateStatus = (outcomeId: number, status: string, notes: string) => {
    setOutcomes((currentOutcomes) =>
      currentOutcomes.map((outcome) =>
        outcome.id === outcomeId
          ? { ...outcome, status, notes }
          : outcome
      )
    );

    toast({
      title: "Outcome Updated",
      description: "The outcome status has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">My Outcomes</h1>
        <OutcomeStatistics outcomes={outcomes} />
        <div className="space-y-6">
          {outcomes.map((outcome) => (
            <OutcomeCard
              key={outcome.id}
              outcome={outcome}
              onUpdateStatus={handleUpdateStatus}
              onUpdateReportingDate={handleUpdateReportingDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOutcomes;
