import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MonthlyAnalytics from "@/components/analytics/MonthlyAnalytics";

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
      </div>

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly" disabled>Quarterly</TabsTrigger>
          <TabsTrigger value="annual" disabled>Annual</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-4">
          <MonthlyAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;