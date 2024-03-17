import { ScheduleItem } from "../types/dashboard";

export const tabs = [
  { name: "Home", logo: "/assets/desktop-dashboard/home.png" },
  { name: "Drugs", logo: "/assets/desktop-dashboard/drugs.png" },
  { name: "Tips", logo: "/assets/desktop-dashboard/tips.png" },
  { name: "Account", logo: "/assets/desktop-dashboard/user.png" },
];

export const tabsMobile = [
  {
    name: "Home",
    logo: "/assets/mobile-dashboard/home.png",
    inactiveLogo: "/assets/mobile-dashboard/home (1).png",
  },
  {
    name: "Drugs",
    logo: "/assets/mobile-dashboard/drugs.png",
    inactiveLogo: "/assets/mobile-dashboard/drugs (1).png",
  },
  {
    name: "Tips",
    logo: "/assets/mobile-dashboard/tips.png",
    inactiveLogo: "/assets/mobile-dashboard/tips (1).png",
  },
  {
    name: "Account",
    logo: "/assets/mobile-dashboard/user.png",
    inactiveLogo: "/assets/mobile-dashboard/user (1).png",
  },
];

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

export const generateSchedule = (drugDetails: any) => {
  const { drug, start, end, frequency, time } = drugDetails;

  const startDate: any = new Date(start);
  const endDate: any = new Date(end);

  const schedule = [];
  let uniqueIndex = 1; // Unique index counter

  // Calculate the difference in days between start and end dates
  const differenceInDays = Math.floor(
    (endDate - startDate) / (1000 * 60 * 60 * 24)
  );

  // Generate the schedule based on frequency and times
  for (let i = 0; i <= differenceInDays; i++) {
    if (
      frequency === "QD" ||
      frequency === "BID" ||
      frequency === "TID" ||
      frequency === "QID"
    ) {
      const dosesPerDay =
        frequency === "BID"
          ? 2
          : frequency === "TID"
          ? 3
          : frequency === "QID"
          ? 4
          : 1;

      for (let j = 0; j < dosesPerDay; j++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);
        const doseTime = time[j % time.length]; // Get the corresponding time from the array

        const scheduleEntry = {
          id: uniqueIndex,
          drug,
          date: currentDate.toISOString().substr(0, 10),
          time: doseTime,
          completed: false, // Set completed as false for each dose
        };

        schedule.push(scheduleEntry);
        uniqueIndex++; // Increment unique index for the next entry
      }
    } else if (frequency === "EOD" && i % 2 === 0) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const doseTime = time[0]; // Get the corresponding time from the array

      const scheduleEntry = {
        id: uniqueIndex,
        drug,
        date: currentDate.toISOString().substr(0, 10),
        time: doseTime,
        completed: false, // Set completed as false for each dose
      };

      schedule.push(scheduleEntry);
      uniqueIndex++; // Increment unique index for the next entry
    } else if (frequency === "W" && i % 7 === 0) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const doseTime = time[0]; // Get the corresponding time from the array

      const scheduleEntry = {
        id: uniqueIndex,
        drug,
        date: currentDate.toISOString().substr(0, 10),
        time: doseTime,
        completed: false, // Set completed as false for each dose
      };

      schedule.push(scheduleEntry);
      uniqueIndex++; // Increment unique index for the next entry
    } else if (frequency === "BW" && i % 14 === 0) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const doseTime = time[0]; // Get the corresponding time from the array

      const scheduleEntry = {
        id: uniqueIndex,
        drug,
        date: currentDate.toISOString().substr(0, 10),
        time: doseTime,
        completed: false, // Set completed as false for each dose
      };

      schedule.push(scheduleEntry);
      uniqueIndex++; // Increment unique index for the next entry
    } else if (frequency === "M") {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);

      if (currentDate.getDate() === startDate.getDate()) {
        const doseTime = time[0]; // Get the corresponding time from the array

        const scheduleEntry = {
          id: uniqueIndex,
          drug,
          date: currentDate.toISOString().substr(0, 10),
          time: doseTime,
          completed: false, // Set completed as false for each dose
        };

        schedule.push(scheduleEntry);
        uniqueIndex++; // Increment unique index for the next entry
      }
    }
  }
  return schedule;
};

type Drug = {
  date: string;
  time: string;
};

type DrugSchedule = Array<Drug>;

function calculateNextDoseTime(schedule: any[], drug?: any): Date | null {
  let nextDoseTime: Date | null = null;

  schedule.forEach((dose) => {
    if (!drug || dose?.drug === drug) {
      const doseTime = new Date(`${dose?.date}T${dose?.time}`);
      const currentTime = new Date();

      if (
        doseTime > currentTime &&
        (!nextDoseTime || doseTime < nextDoseTime)
      ) {
        nextDoseTime = doseTime;
      }
    }
  });

  return nextDoseTime;
}

export function calculateClosestDoseCountdown(schedule: DrugSchedule): string {
  let closestDose: Drug | null = null;
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