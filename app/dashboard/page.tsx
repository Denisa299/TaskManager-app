
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, CheckCircle2 } from "lucide-react";
import { RecentTasks } from "@/components/dashboard/recent-tasks";
import { Progress } from "@/components/ui/progress";

const DashboardPage = () => {
  const stats = {
    totalTasks: 2,
    completedTasks: 1,
    inProgress: 1,
  };

  const completionRate = stats.totalTasks
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="p-6 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Vezi progresul taskurilor tale.</p>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
      </div>

      {/* Taskuri recente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Taskuri recente</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <RecentTasks />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
