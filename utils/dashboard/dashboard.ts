import { DrugProps, ScheduleItem } from "../../types/dashboard";
import { Home, Pill, User } from "lucide-react";

export const tabs = [
  { name: "Home", icon: Home },
  { name: "Drugs", icon: Pill },
  { name: "Account", icon: User },
] as const;

export const days = ["Yesterday", "Today"] as const;

// Dosage frequency configuration
export const dose = [
  { frequency: "QD", times: 1, time: ["08:00"] },
  { frequency: "EOD", times: 1, time: ["08:00"] },
  { frequency: "W", times: 1, time: ["08:00"] },
  { frequency: "BW", times: 1, time: ["08:00"] },
  { frequency: "M", times: 1, time: ["08:00"] },
  { frequency: "BID", times: 2, time: ["08:00", "20:00"] },
  { frequency: "TID", times: 3, time: ["06:00", "14:00", "22:00"] },
  { frequency: "QID", times: 4, time: ["06:00", "12:00", "18:00", "00:00"] },
] as const;

export const frequencyToPlaceholder: Record<string, string> = {
  QD: "Once daily",
  BID: "Twice daily",
  TID: "Thrice daily",
  QID: "Four times daily",
  EOD: "Every other day",
  W: "Weekly",
  BW: "Biweekly",
  M: "Monthly",
} as const;

// Constants for time calculations
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

// Frequency dose mapping for better performance
const FREQUENCY_DOSES: Record<string, number> = {
  QD: 1,
  BID: 2,
  TID: 3,
  QID: 4,
};

// Date utilities
const formatDateISO = (date: Date): string => date.toISOString().slice(0, 10);

const createDateTime = (date: string, time: string): Date => 
  new Date(`${date}T${time}`);

const getDaysDifference = (start: Date, end: Date): number =>
  Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY);

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Schedule entry factory
const createScheduleEntry = (
  drugDetails: DrugProps,
  date: Date,
  time: string,
  id: number
): ScheduleItem => ({
  id,
  drug: drugDetails.drug,
  date: formatDateISO(date),
  time,
  completed: false,
  drugId: drugDetails.drugId,
});

// Frequency handlers for better separation of concerns
const shouldIncludeEOD = (dayIndex: number): boolean => dayIndex % 2 === 0;
const shouldIncludeWeekly = (dayIndex: number): boolean => dayIndex % 7 === 0;
const shouldIncludeBiweekly = (dayIndex: number): boolean => dayIndex % 14 === 0;
const shouldIncludeMonthly = (currentDate: Date, startDate: Date): boolean =>
  currentDate.getDate() === startDate.getDate();

export const generateSchedule = (drugDetails: DrugProps): ScheduleItem[] => {
  const { start, end, frequency, time } = drugDetails;
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  const daysDifference = getDaysDifference(startDate, endDate);
  
  const schedule: ScheduleItem[] = [];
  let uniqueIndex = 1;

  // Handle daily frequencies (QD, BID, TID, QID)
  if (frequency in FREQUENCY_DOSES) {
    const dosesPerDay = FREQUENCY_DOSES[frequency];
    
    for (let day = 0; day <= daysDifference; day++) {
      const currentDate = addDays(startDate, day);
      
      for (let dose = 0; dose < dosesPerDay; dose++) {
        schedule.push(
          createScheduleEntry(
            drugDetails,
            currentDate,
            time[dose % time.length],
            uniqueIndex++
          )
        );
      }
    }
    return schedule;
  }

  // Handle non-daily frequencies
  for (let day = 0; day <= daysDifference; day++) {
    const currentDate = addDays(startDate, day);
    let shouldInclude = false;

    switch (frequency) {
      case "EOD":
        shouldInclude = shouldIncludeEOD(day);
        break;
      case "W":
        shouldInclude = shouldIncludeWeekly(day);
        break;
      case "BW":
        shouldInclude = shouldIncludeBiweekly(day);
        break;
      case "M":
        shouldInclude = shouldIncludeMonthly(currentDate, startDate);
        break;
    }

    if (shouldInclude) {
      schedule.push(
        createScheduleEntry(drugDetails, currentDate, time[0], uniqueIndex++)
      );
    }
  }

  return schedule;
};

// Optimized next dose calculation using reduce
const calculateNextDoseTime = (schedule: ScheduleItem[]): Date | null => {
  const currentTime = new Date().getTime();

  return schedule.reduce<Date | null>((nextDose, dose) => {
    const doseTime = createDateTime(dose.date, dose.time);
    const doseTimestamp = doseTime.getTime();

    if (doseTimestamp <= currentTime) return nextDose;
    if (!nextDose || doseTimestamp < nextDose.getTime()) return doseTime;

    return nextDose;
  }, null);
};

// Time formatting utilities
const padZero = (num: number): string => num.toString().padStart(2, "0");

const formatTimeRemaining = (timeDiff: number): string => {
  const days = Math.floor(timeDiff / MS_PER_DAY);
  
  if (days >= 1) {
    return `${days} day${days > 1 ? "s" : ""}`;
  }

  const hours = Math.floor(timeDiff / MS_PER_HOUR);
  const minutes = Math.floor((timeDiff % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((timeDiff % MS_PER_MINUTE) / MS_PER_SECOND);

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
};

export const calculateClosestDoseCountdown = (
  schedule: ScheduleItem[]
): string => {
  if (!schedule.length) return "00:00:00";

  const nextDoseTime = calculateNextDoseTime(schedule);
  
  if (!nextDoseTime) return "00:00:00";

  const timeDiff = nextDoseTime.getTime() - Date.now();

  return timeDiff > 0 ? formatTimeRemaining(timeDiff) : "00:00:00";
};

// Date formatting
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

// Optimized past dose filtering
interface FilteredDosesResult {
  remainingDoses: ScheduleItem[];
  filteredDoses: ScheduleItem[];
}

export const filterPastDoses = (
  doses: ScheduleItem[]
): FilteredDosesResult => {
  const currentTime = Date.now();
  const cutoffTime = currentTime - MS_PER_DAY;

  return doses.reduce<FilteredDosesResult>(
    (result, dose) => {
      const doseTime = createDateTime(dose.date, dose.time).getTime();
      const isWithin24Hours = doseTime > cutoffTime && doseTime <= currentTime;

      if (isWithin24Hours) {
        result.filteredDoses.push(dose);
      } else {
        result.remainingDoses.push(dose);
      }

      return result;
    },
    { remainingDoses: [], filteredDoses: [] }
  );
};

// Optimized date format conversion
export const formatDateToSlash = (inputDate: string): string => {
  const [year, month, day] = inputDate.split("-");
  return `${day}/${month}/${year}`;
};