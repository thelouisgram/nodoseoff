import { ScheduleItem } from "../../types/dashboard/dashboard";
import { ExtendedDrugData } from "../../types/dashboard/drug";

export function calculateCompliance(
  schedule: ScheduleItem[]
): Record<string, ExtendedDrugData> {
  const drugData: Record<string, ExtendedDrugData> = {};
  const now = new Date();

  for (const record of schedule) {
    const { date, time, completed, drugId } = record;

    // Initialize drug data
    if (!drugData[drugId]) {
      drugData[drugId] = {
        totalDoses: 0,
        pastDoses: 0,
        remainingDoses: 0,
        completedPastDoses: 0,
        missedPastDoses: 0,
        compliance: 0,
        scheduledTimestamps: [],
        completedTimestamps: [],
        missedTimestamps: [],
        remainingTimestamps: [],
        missedDoses: 0,
        completedDoses: 0,
      };
    }

    // ✅ Safe datetime creation
    const [hours, minutes] = time.split(":").map(Number);
    const doseDateTime = new Date(date);
    doseDateTime.setHours(hours, minutes, 0, 0);

    const drug = drugData[drugId];

    // Track total doses
    drug.totalDoses += 1;
    drug.scheduledTimestamps.push(doseDateTime);

    // ================= TIME LOGIC =================
    if (doseDateTime < now) {
      // Past dose (should have been taken)
      drug.pastDoses += 1;

      if (completed) {
        drug.completedPastDoses += 1;
        drug.completedDoses += 1;
        drug.completedTimestamps.push(doseDateTime);
      } else {
        drug.missedPastDoses += 1;
        drug.missedDoses += 1;
        drug.missedTimestamps.push(doseDateTime);
      }
    } else {
      // Future dose (not due yet)
      drug.remainingDoses += 1;
      drug.remainingTimestamps.push(doseDateTime);

      // Optional: allow early completion tracking
      if (completed) {
        drug.completedDoses += 1;
        drug.completedTimestamps.push(doseDateTime);
      }
    }
  }

  // ================= COMPLIANCE CALC =================
  for (const drugId in drugData) {
    const drug = drugData[drugId];

    drug.compliance =
      drug.pastDoses > 0
        ? Math.round(
            (drug.completedPastDoses / drug.pastDoses) * 100
          )
        : 0;
  }

  return drugData;
}



  // utils/dashboard/drugDetailsConfig.ts

import { Detail } from "../../types/dashboard/drug";
import { formatDate, frequencyToPlaceholder } from "./dashboard";
import { calculateTimePeriod, convertedTimes } from "../drugs";

export interface DrugDetailsData {
  frequency: string;
  time: string[];
  start: string;
  end: string;
  reminder: boolean;
  totalDoses: number;
  completedDoses: number;
  missedDoses: number;
  remainingDoses: number;
}

export function generateDrugDetails(data: DrugDetailsData): Detail[] {
  const { frequency, time, start, end, reminder, totalDoses, completedDoses, missedDoses, remainingDoses } = data;
  
  const duration = calculateTimePeriod(start, end);

  return [
    { 
      name: "Frequency", 
      details: frequencyToPlaceholder[frequency] 
    },
    { 
      name: "Time Schedule", 
      details: convertedTimes(time).join(", ") 
    },
    { 
      name: "Treatment Duration", 
      details: duration 
    },
    { 
      name: "Reminder Set", 
      details: reminder ? "Yes" : "No" 
    },
    { 
      name: "Start Date", 
      details: formatDate(start) 
    },
    { 
      name: "End Date", 
      details: formatDate(end) 
    },
    { 
      name: "Total Doses", 
      details: totalDoses 
    },
    { 
      name: "Completed Doses", 
      details: completedDoses 
    },
    { 
      name: "Missed Doses", 
      details: missedDoses 
    },
    { 
      name: "Remaining Doses", 
      details: remainingDoses 
    },
  ];
}
