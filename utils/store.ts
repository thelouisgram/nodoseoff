import { Effect } from "@/Layout/dashboard/home/DailyReports";
import { DrugProps, ScheduleItem } from "../types/dashboard";
import { AllergicItemProps } from "../types/dashboardDrugs";

export interface AppType {
  info: Info[];
  isAuthenticated: boolean;
  userId: string;
  drugs: DrugProps[];
  completedDrugs: DrugProps[];
  effects: Effect[];
  schedule: ScheduleItem[];
  activeDrug: string;
  allergies: AllergicItemProps[];
  drugDetails: DrugProps[];
  searchedWord: string;
  activeAllergy: string;
  active: string;
}

export interface Info{
  name: string ;
  phone: string ;
  email: string ;
  role: string ;
  otcDrugs: string;
  herbs: string;
}