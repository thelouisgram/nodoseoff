import { Dayjs } from "dayjs";

export interface DailyReportsProps {
    selectDate: Dayjs
    today: Dayjs
}

export interface ScheduleItem {
   id: number;
   drug: string;
   date: string;
   time: string;
   completed: boolean;
 }

 export interface DrugProps {
  drug: string;
  end: string;
  frequency: string;
  reminder: boolean;
  route: string;
  start: string;
  time: string[];
}