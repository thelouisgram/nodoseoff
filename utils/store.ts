import { DrugProps, ScheduleItem } from "../types/dashboard/dashboard";

export interface AppType {
  info: Info[];
  isAuthenticated: boolean;
  userId: string;
  drugs: DrugProps[];
  completedDrugs: DrugProps[];
  schedule: ScheduleItem[];
  activeDrug: string;
  allergies: DrugProps[];
  drugDetails: DrugProps[];
  searchedWord: string;
  activeAllergy: string;
  active: string;
  profilePicture: string;
  activeDrugId: string;
  otcDrugs: string;
  herbs: string
}

export interface Info{
  name: string ;
  phone: string ;
  email: string ;
}