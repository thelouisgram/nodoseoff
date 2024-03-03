import { ScheduleItem } from "../types/dashboard";

export interface AppType {
  info: Info[];
  isAuthenticated: boolean;
  userId: string;
  drugs: any[];
  completedDrugs: any[];
  effects: any[];
  schedule: ScheduleItem[];
  activeDrug: string;
  allergies: any[];
  drugDetails: any;
  searchedWord: string;
  activeAllergy: string;
  active: string;
}

export interface Info{
  name: string ;
  phone: string ;
  email: string ;
  role: string ;
}