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

export type Process = {
  id: number;
  title: string;
  description: string;
  interval: 'weekly' | 'monthly';
  nextDue: string;
  status: string;
  startDate: Date;
  reportingDates?: ReportingDateStatus[];
};