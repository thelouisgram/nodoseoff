import { ScheduleItem } from "../../types/dashboard";

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

/**
 * Calculate compliance metrics for a specific drug based on drugId
 * @param schedule - Array of all scheduled doses
 * @param drugId - The specific drug ID to calculate compliance for
 * @returns Compliance data object with metrics for the specific drug
 */
export const calculateDrugCompliance = (schedule: any[], drugId: string) => {
  // Filter schedule to get only doses for this specific drug
  const drugDoses = schedule.filter((dose) => dose.drugId === drugId);

  if (drugDoses.length === 0) {
    return {
      totalDoses: 0,
      completedDoses: 0,
      missedDoses: 0,
      remainingDoses: 0,
      compliance: 0,
    };
  }

  const currentTime = new Date();
  const totalDoses = drugDoses.length;
  
  // Count completed doses (dose.completed === true AND dose time has passed)
  const completedDoses = drugDoses.filter((dose) => {
    const doseDateTime = new Date(`${dose.date}T${dose.time}`);
    return dose.completed === true && doseDateTime < currentTime;
  }).length;

  // Count missed doses (dose.completed === false AND dose time has passed)
  const missedDoses = drugDoses.filter((dose) => {
    const doseDateTime = new Date(`${dose.date}T${dose.time}`);
    return dose.completed === false && doseDateTime < currentTime;
  }).length;

  // Calculate remaining doses (doses scheduled after current time, regardless of completion status)
  const remainingDoses = drugDoses.filter((dose) => {
    const doseDateTime = new Date(`${dose.date}T${dose.time}`);
    return doseDateTime >= currentTime;
  }).length;

  // Calculate compliance percentage
  const dosesAccountedFor = completedDoses + missedDoses;
  const compliance = dosesAccountedFor > 0 
    ? Math.round((completedDoses / dosesAccountedFor) * 100) 
    : 0;

  return {
    totalDoses,
    completedDoses,
    missedDoses,
    remainingDoses,
    compliance,
  };
};


export function getDrugCompliance(schedule: ScheduleItem[], drug: string | null) {
  
  return;
}


  // utils/dashboard/drugDetailsConfig.ts

import { Detail } from "../../types/drug";
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
