import { DrugProps, ScheduleItem } from "../types/dashboard";

export interface AppType {
  info: Info[];
  isAuthenticated: boolean;
  userId: string;
  drugs: DrugProps[];
  completedDrugs: DrugProps[];
  schedule: ScheduleItem[];
  allergies: DrugProps[];
  drugDetails: DrugProps[];
  activeAllergy: string;
  profilePicture: string;
  otcDrugs: string;
  herbs: string
}

export interface Info{
  name: string ;
  phone: string ;
  email: string ;
}