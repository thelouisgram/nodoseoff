import dayjs from "dayjs";
import { ScheduleItem } from "../../types/dashboard";

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

  const now = dayjs();
  const totalDoses = drugDoses.length;
  
  // Count completed doses (all doses where completed === true)
  const completedDoses = drugDoses.filter((dose) => dose.completed === true).length;

  // Count missed doses (past doses that were not completed)
  const missedDoses = drugDoses.filter((dose) => {
    const doseTime = dayjs(`${dose.date}T${dose.time}`);
    return dose.completed === false && doseTime.isBefore(now);
  }).length;

  // Count remaining doses (future doses that are not yet completed)
  const remainingDoses = drugDoses.filter((dose) => {
    const doseTime = dayjs(`${dose.date}T${dose.time}`);
    return dose.completed === false && (doseTime.isAfter(now) || doseTime.isSame(now));
  }).length;

  // Calculate compliance percentage based on doses that SHOULD have been taken
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

/**
 * Calculate overall lifetime compliance for the entire schedule up to now
 * @param schedule - Array of all scheduled doses
 * @returns Overall compliance percentage
 */
export const calculateOverallCompliance = (schedule: any[]) => {
  if (!schedule || schedule.length === 0) return 0;

  const now = dayjs();
  
  // Count completed doses (all doses where completed === true)
  const completedDoses = schedule.filter((dose) => dose.completed === true).length;

  // Count missed doses (past doses that were not completed)
  const missedDoses = schedule.filter((dose) => {
    const doseTime = dayjs(`${dose.date}T${dose.time}`);
    return dose.completed === false && doseTime.isBefore(now);
  }).length;

  const dosesAccountedFor = completedDoses + missedDoses;
  
  return dosesAccountedFor > 0 
    ? Math.round((completedDoses / dosesAccountedFor) * 100) 
    : 0;
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
