import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building } from "lucide-react";

const Companies = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Companies</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Company
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
          <CardDescription>Manage and monitor all companies under your advisory.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No companies added yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Companies;