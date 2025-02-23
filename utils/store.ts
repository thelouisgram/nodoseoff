import { Effect } from "@/Layout/dashboard/home/Reports";
import { DrugProps, ScheduleItem } from "../types/dashboard";

export interface AppType {
  info: Info[];
  isAuthenticated: boolean;
  userId: string;
  drugs: DrugProps[];
  completedDrugs: DrugProps[];
  effects: Effect[];
  schedule: ScheduleItem[];
  activeDrug: string;
  allergies: DrugProps[];
  drugDetails: DrugProps[];
  searchedWord: string;
  activeAllergy: string;
  active: string;
  confetti: boolean;
  profilePicture: string;
  activeDrugId: string
}

export interface Info{
  name: string ;
  phone: string ;
  email: string ;
  otcDrugs: string;
  herbs: string;
}