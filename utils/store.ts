import { ScheduleItem } from "../types/dashboard";

export interface AppType {
  info: Info[];
  isAuthenticated: boolean;
  userId: string;
  drugs: any[];
  effects: any[];
  schedule: ScheduleItem[];
  activeDrug: string;
  allergies: string[];
  drugDetails: any;
  searchedWord: string;
  pastSchedule: ScheduleItem[];
  combinedSchedule: ScheduleItem[];
  activeAllergy: string;
  active: string;
}

export interface Info{
  name: string ;
  phone: string ;
  email: string ;
  role: string ;
}