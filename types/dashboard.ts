export interface DailyReportsProps {
    selectDate: any
    today: any
}

export interface ScheduleItem {
   id: number;
   drug: string;
   date: string;
   time: string;
   completed: boolean;
   // Add any other properties if present in the actual data structure
 }