import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ProcessTimeline from "./ProcessTimeline";
import ProcessStatusSummary from "./ProcessStatusSummary";

interface ProcessCardProps {
  process: any;
}

const ProcessCard = ({ process }: ProcessCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">{process.title}</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">Owner: {process.owner}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {process.interval}
            </Badge>
            {process.teamName && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {process.teamName}
              </Badge>
            )}
          </div>
        </div>

        <ProcessStatusSummary process={process} />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="dates" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium text-gray-600">
                View Timeline
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ProcessTimeline process={process} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default ProcessCard;