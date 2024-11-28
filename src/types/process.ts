export type ReportingDateStatus = {
  date: Date;
  status: 'pending' | 'completed' | 'overdue';
  notes?: string;
  updatedBy?: string;
  updatedAt?: Date;
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