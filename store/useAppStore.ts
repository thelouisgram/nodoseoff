import { create } from "zustand";
import { AppState } from "../types/store";

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: true,
  userId: "",

  activeTab: "Home",
  activeDrug: "",
  activeDrugId: "",
  activeAllergy: "",
  searchedWord: "",

  setIsAuthenticated: (v) => set({ isAuthenticated: v }),
  setUserId: (id) => set({ userId: id }),

  setActiveTab: (v) => set({ activeTab: v }),
  setActiveDrug: (v) => set({ activeDrug: v }),
  setActiveDrugId: (v) => set({ activeDrugId: v }),
  setActiveAllergy: (v) => set({ activeAllergy: v }),
  setSearchedWord: (v) => set({ searchedWord: v }),

}));
