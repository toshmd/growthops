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

export type Outcome = {
  id: number;
  title: string;
  description: string;
  interval: Interval;
  nextDue: string;
  status: string;
  startDate: Date;
  reportingDates?: ReportingDateStatus[];
};