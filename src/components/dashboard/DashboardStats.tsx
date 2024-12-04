import { OutcomeWithProfile } from "@/hooks/useDashboardData";
import { isPast, parseISO } from "date-fns";
import { Outcome } from "@/types/outcome";

export const calculateDashboardStats = (outcomes: OutcomeWithProfile[] | undefined) => {
  return {
    total: outcomes?.length || 0,
    completed: outcomes?.filter(p => p.status === 'completed').length || 0,
    inProgress: outcomes?.filter(p => p.status === 'in_progress').length || 0,
    overdue: outcomes?.filter(p => {
      const dueDate = parseISO(p.next_due);
      return isPast(dueDate) && p.status !== 'completed';
    }).length || 0,
  };
};

export const mapOutcomesToDueThisWeek = (outcomes: OutcomeWithProfile[] | undefined): Outcome[] => {
  if (!outcomes) return [];
  
  return outcomes.map(outcome => ({
    id: parseInt(outcome.id),
    title: outcome.title,
    description: outcome.description || '',
    interval: outcome.interval as Outcome['interval'],
    nextDue: outcome.next_due,
    status: outcome.status || 'pending',
    startDate: new Date(outcome.start_date),
    teamId: outcome.team_id,
    reportingDates: [],
  }));
};