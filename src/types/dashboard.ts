import { Dayjs } from "dayjs";

export interface ReportsProps {
    selectDate: Dayjs
    today: Dayjs
}

export interface ScheduleItem {
   id: number;
   drug: string;
   date: string;
   time: string;
   completed: boolean;
   drugId:string;
 }

 export interface DrugProps {
  id?: number;
  drug: string;
  end: string;
  frequency: string;
  reminder: boolean;
  route: string;
  start: string;
  time: string[];
  drugId: string;
}

/** Next clinician appointment saved from the Home tab */
export interface Appointment {
  doctor: string;
  location: string;
  startsAt: string;
  notes: string;
}

export type HealthJournalKind = "mood" | "side_effect" | "note";

/** Mood / side-effect / note entry logged from Home for AMANDA context */
export interface HealthJournalEntry {
  id: number;
  kind: HealthJournalKind;
  mood: string;
  severity: number | null;
  symptom: string;
  drug: string;
  drugId: string;
  notes: string;
  loggedAt: string;
}
