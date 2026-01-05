import { DrugProps, ScheduleItem } from "../../types/dashboard";
import { Home, Pill, User } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface TabItem {
  name: string;
  icon: LucideIcon;
}

export const tabs: TabItem[] = [
  { name: "Home", icon: Home },
  { name: "Drugs", icon: Pill },
  { name: "Account", icon: User },
];

export const days = [
  "Yesterday", 'Today'
]

export const dose = [
  { frequency: "QD", times: 1, time: ["08:00"] },
  { frequency: "EOD", times: 1, time: ["08:00"] },
  { frequency: "W", times: 1, time: ["08:00"] },
  { frequency: "BW", times: 1, time: ["08:00"] },
  { frequency: "M", times: 1, time: ["08:00"] },
  { frequency: "BID", times: 2, time: ["08:00", "20:00"] },
  { frequency: "TID", times: 3, time: ["06:00", "14:00", "22:00"] },
  { frequency: "QID", times: 4, time: ["06:00", "12:00", "18:00", "00:00"] },
];

export const frequencyToPlaceholder: { [key: string]: string } = {
  QD: "Once daily",
  BID: "Twice daily",
  TID: "Thrice daily",
  QID: "Four times daily",
  EOD: "Every other day",
  W: "Weekly",
  BW: "Biweekly",
  M: "Monthly",
};

export const generateSchedule = (drugDetails: DrugProps) => {
  const { drug, start, end, frequency, time, drugId } = drugDetails;

  const startDate = new Date(start);
  const endDate = new Date(end);

  // Generate unique drugId for this specific schedule
  const schedule = [];
  let uniqueIndex = 1;

  const differenceInDays = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Helper function to create schedule entry
  const createEntry = (date: Date, timeSlot: string) => ({
    id: uniqueIndex++,
    drug,
    date: date.toISOString().slice(0, 10),
    time: timeSlot,
    completed: false,
    drugId,
  });

  // Helper function to add date offset
  const getDate = (offset: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + offset);
    return date;
  };

  // Generate schedule based on frequency
  for (let i = 0; i <= differenceInDays; i++) {
    const currentDate = getDate(i);

    switch (frequency) {
      case "QD":
      case "BID":
      case "TID":
      case "QID": {
        const dosesPerDay = {
          QD: 1,
          BID: 2,
          TID: 3,
          QID: 4,
        }[frequency];

        for (let j = 0; j < dosesPerDay; j++) {
          schedule.push(createEntry(currentDate, time[j % time.length]));
        }
        break;
      }

      case "EOD":
        if (i % 2 === 0) {
          schedule.push(createEntry(currentDate, time[0]));
        }
        break;

      case "W":
        if (i % 7 === 0) {
          schedule.push(createEntry(currentDate, time[0]));
        }
        break;

      case "BW":
        if (i % 14 === 0) {
          schedule.push(createEntry(currentDate, time[0]));
        }
        break;

      case "M":
        if (currentDate.getDate() === startDate.getDate()) {
          schedule.push(createEntry(currentDate, time[0]));
        }
        break;
    }
  }

  return schedule;
};

function calculateNextDoseTime(schedule: ScheduleItem[]): Date | null {
  let nextDoseTime: Date | null = null;

  schedule.forEach((dose) => {
    const doseTime = new Date(`${dose?.date}T${dose?.time}`);
    const currentTime = new Date();

    if (
      doseTime > currentTime &&
      (!nextDoseTime || doseTime < nextDoseTime)
    ) {
      nextDoseTime = doseTime;
    }
});

  return nextDoseTime;
}

export function calculateClosestDoseCountdown(schedule: ScheduleItem[]): string {
  let closestDose: DrugProps | null = null;
  let nextDoseTime: Date | null = null;

  function updateCountdown() {
    if (!nextDoseTime) {
      // Calculate next dose time and store it
      nextDoseTime = calculateNextDoseTime(schedule);
    }

    if (!nextDoseTime) {
      return "00:00:00"; // No upcoming doses found
    }

    const currentTime = new Date();
    const timeDiff = nextDoseTime.getTime() - currentTime.getTime();

    if (timeDiff > 0) {
      // Calculate time durations
      const seconds = Math.floor(timeDiff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days >= 1) {
        // If days are more than or equal to 1, return days
        return `${days} days`;
      } else {
        // If remaining time is less than 24 hours, format as HH:MM:SS
        const remainingHours = Math.floor(timeDiff / 3600000); // 1 hour = 3600000 milliseconds
        const remainingMinutes = Math.floor((timeDiff % 3600000) / 60000); // 1 minute = 60000 milliseconds
        const remainingSeconds = Math.floor((timeDiff % 60000) / 1000); // 1 second = 1000 milliseconds

        return `${remainingHours.toString().padStart(2, "0")}:${remainingMinutes
          .toString()
          .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
      }
    } else {
      // Next dose time has passed, recalculate next dose time and update countdown
      nextDoseTime = null;
      return updateCountdown();
    }
  }

  return updateCountdown();
}

export function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
}

interface FilteredDosesResult {
    remainingDoses: ScheduleItem[];
    filteredDoses: ScheduleItem[];
}

export function filterPastDoses(doses: ScheduleItem[]): FilteredDosesResult {
    const twentyFourHoursInMilliseconds: number = 24 * 60 * 60 * 1000;
    const currentTime: number = Date.now();

    const filteredDoses: ScheduleItem[] = [];
    const remainingDoses: ScheduleItem[] = doses.filter((dose: ScheduleItem) => {
        const doseTime: number = new Date(`${dose.date}T${dose.time}`).getTime();
        const isWithin24Hours: boolean = currentTime - doseTime <= twentyFourHoursInMilliseconds;

        if (isWithin24Hours) {
            filteredDoses.push(dose);
            return false;
        }

        return true;
    });

    return { remainingDoses, filteredDoses };
}


export function formatDateToSlash(inputDate:string) {
    // Split the input date string into year, month, and day
    var parts = inputDate.split('-');
    
    // Rearrange the parts into the desired format
    var formattedDate = parts[2] + '/' + parts[1] + '/' + parts[0];
    
    // Return the formatted date
    return formattedDate;
}