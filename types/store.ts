import { Info } from "./user";

export type AppState = {
  isAuthenticated: boolean;
  userId: string;
  profilePicture: string;

  activeTab: string;
  activeDrug: string;
  activeDrugId: string;
  activeAllergy: string;
  searchedWord: string;

  info: Info[];
  otcDrugs: string;
  herbs: string;

  setIsAuthenticated: (v: boolean) => void;
  setUserId: (id: string) => void;
  setProfilePicture: (url: string) => void;

  setActiveTab: (v: string) => void;
  setActiveDrug: (v: string) => void;
  setActiveDrugId: (v: string) => void;
  setActiveAllergy: (v: string) => void;
  setSearchedWord: (v: string) => void;

  setInfo: (info: Info[]) => void;
  setOtcDrugs: (v: string) => void;
  setHerbs: (v: string) => void;
};