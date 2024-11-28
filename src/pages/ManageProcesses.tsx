import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus } from "lucide-react";
import CreateProcess from "./CreateProcess";

// Mock data - in a real app, this would come from an API
const mockProcesses = {
  "HR": [
    { id: 1, title: "Employee Onboarding", interval: "weekly" },
    { id: 2, title: "Performance Review", interval: "quarterly" },
  ],
  "Finance": [
    { id: 3, title: "Monthly Budget Review", interval: "monthly" },
    { id: 4, title: "Annual Tax Filing", interval: "annual" },
  ],
};

const ManageProcesses = () => {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState("");
  const [showCreateProcess, setShowCreateProcess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      // In a real app, this would make an API call
      toast({
        title: "Category Added",
        description: `Category "${newCategory}" has been created.`,
      });
      setNewCategory("");
    }
  };

  const handleCreateProcess = (category: string) => {
    setSelectedCategory(category);
    setShowCreateProcess(true);
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Processes</h1>
      
      {/* Add new category section */}
      <div className="mb-8 flex gap-4 items-center">
        <Input
          placeholder="Enter new category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleAddCategory}>Add Category</Button>
      </div>

      {/* Categories and processes accordion */}
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(mockProcesses).map(([category, processes]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="text-lg">
              <div className="flex justify-between items-center w-full pr-4">
                <span>{category}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateProcess(category);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Process
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                {processes.map((process) => (
                  <div
                    key={process.id}
                    className="flex justify-between items-center p-4 rounded-lg border bg-card"
                  >
                    <div>
                      <h3 className="font-medium">{process.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Interval: {process.interval}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {showCreateProcess && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            <h2 className="text-lg font-semibold">
              Create Process in {selectedCategory}
            </h2>
            <CreateProcess />
            <Button
              variant="outline"
              onClick={() => setShowCreateProcess(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProcesses;