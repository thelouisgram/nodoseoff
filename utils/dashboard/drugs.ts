import { ScheduleItem } from "../../types/dashboard/dashboard";

export interface calculateComplianceProps {
  totalDoses: number;
  pastDoses: number;
  remainingDoses: number;
  completedPastDoses: number;
  missedPastDoses: number;
  compliance: number; // percentage of past doses taken
  scheduledTimestamps: Date[];
  completedTimestamps: Date[];
  missedTimestamps: Date[];
  remainingTimestamps: Date[];
  missedDoses: number;
  completedDoses: number;
}

export function calculateCompliance(
  schedule: ScheduleItem[]
): Record<string, calculateComplianceProps> {
  const drugData: Record<string, calculateComplianceProps> = {};
  const now = new Date();

  for (const record of schedule) {
    const { date, time, completed, drug } = record;

    if (!drugData[drug]) {
      drugData[drug] = {
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

    const drugEntry = drugData[drug];
    const [hours, minutes] = time.split(":").map(Number);
    const doseDateTime = new Date(date);
    doseDateTime.setHours(hours, minutes, 0, 0);

    drugEntry.totalDoses += 1;
    drugEntry.scheduledTimestamps.push(doseDateTime);

    if (doseDateTime < now) {
      drugEntry.pastDoses += 1;
      if (completed) {
        drugEntry.completedPastDoses += 1;
        drugEntry.completedDoses += 1;
        drugEntry.completedTimestamps.push(doseDateTime);
      } else {
        drugEntry.missedPastDoses += 1;
        drugEntry.missedDoses += 1;
        drugEntry.missedTimestamps.push(doseDateTime);
      }
    } else {
      drugEntry.remainingDoses += 1;
      drugEntry.remainingTimestamps.push(doseDateTime);
      if (completed) {
        drugEntry.completedDoses += 1;
        drugEntry.completedTimestamps.push(doseDateTime);
      }
    }
  }

  for (const drug in drugData) {
    const d = drugData[drug];
    d.compliance =
      d.pastDoses > 0 ? Math.round((d.completedPastDoses / d.pastDoses) * 100) : 0;
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
