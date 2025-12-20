import { create } from "zustand";
import { AppState } from "../types/store";

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: true,
  userId: "",
  profilePicture: "",

  activeTab: "Home",
  activeDrug: "",
  activeDrugId: "",
  activeAllergy: "",
  searchedWord: "",

  info: [{ name: "", phone: "", email: "" }],
  otcDrugs: "",
  herbs: "",

  setIsAuthenticated: (v) => set({ isAuthenticated: v }),
  setUserId: (id) => set({ userId: id }),
  setProfilePicture: (url) => set({ profilePicture: url }),

  setActiveTab: (v) => set({ activeTab: v }),
  setActiveDrug: (v) => set({ activeDrug: v }),
  setActiveDrugId: (v) => set({ activeDrugId: v }),
  setActiveAllergy: (v) => set({ activeAllergy: v }),
  setSearchedWord: (v) => set({ searchedWord: v }),

  setInfo: (info) => set({ info }),
  setOtcDrugs: (v) => set({ otcDrugs: v }),
  setHerbs: (v) => set({ herbs: v }),
}));
