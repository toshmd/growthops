export type Interval = "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "biannual" | "annual";

export type ActionItem = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

export type ReportingDateStatus = {
  date: Date;
  status: 'pending' | 'completed' | 'blocked';
  notes?: string;
  updatedBy?: string;
  updatedAt?: Date;
  actionItems: ActionItem[];
};

export interface SupabaseOutcome {
  id: string;
  title: string;
  description: string;
  interval: string;  // Changed from Interval to string since Supabase returns it as string
  next_due: string;
  status: string;
  start_date: string;
  team_id?: string;
  company_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  parent_outcome_id?: string;
}

export interface Outcome {
  id: number;
  title: string;
  description: string;
  interval: Interval;
  nextDue: string;
  status: string;
  startDate: Date;
  teamId?: string;
  reportingDates?: ReportingDateStatus[];
}