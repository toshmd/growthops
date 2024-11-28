import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isWeekend,
  nextMonday,
  startOfDay,
} from "date-fns";

type Interval = "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "biannual" | "annual";

export const calculateNextDate = (currentDate: Date, interval: Interval): Date => {
  let nextDate = startOfDay(currentDate);

  switch (interval) {
    case "daily":
      nextDate = addDays(nextDate, 1);
      break;
    case "weekly":
      nextDate = addWeeks(nextDate, 1);
      break;
    case "biweekly":
      nextDate = addWeeks(nextDate, 2);
      break;
    case "monthly":
      nextDate = addMonths(nextDate, 1);
      break;
    case "quarterly":
      nextDate = addMonths(nextDate, 3);
      break;
    case "biannual":
      nextDate = addMonths(nextDate, 6);
      break;
    case "annual":
      nextDate = addYears(nextDate, 1);
      break;
  }

  // If the calculated date falls on a weekend, move it to the next Monday
  return isWeekend(nextDate) ? nextMonday(nextDate) : nextDate;
};

export const calculateFutureReportingDates = (
  startDate: Date,
  interval: Interval,
  numberOfDates: number = 24 // 2 years worth of monthly dates
): Date[] => {
  const dates: Date[] = [];
  let currentDate = startDate;

  for (let i = 0; i < numberOfDates; i++) {
    currentDate = calculateNextDate(currentDate, interval);
    dates.push(currentDate);
  }

  return dates;
};