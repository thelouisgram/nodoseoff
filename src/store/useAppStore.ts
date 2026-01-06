import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  userId: string;
  isAuthenticated: boolean;
  activeTab: string;
  activeDrug: string;
  activeDrugId: string;
  activeAllergy: string;
  searchedWord: string;
  setUserId: (id: string) => void;
  setIsAuthenticated: (val: boolean) => void;
  setActiveTab: (tab: string) => void;
  setActiveDrug: (drug: string) => void;
  setActiveDrugId: (id: string) => void;
  setActiveAllergy: (allergy: string) => void;
  setSearchedWord: (word: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userId: "",
      isAuthenticated: false,
      activeTab: "Dashboard",
      activeDrug: "",
      activeDrugId: "",
      activeAllergy: "",
      searchedWord: "",
      setUserId: (userId) => set({ userId }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setActiveDrug: (activeDrug) => set({ activeDrug }),
      setActiveDrugId: (activeDrugId) => set({ activeDrugId }),
      setActiveAllergy: (activeAllergy) => set({ activeAllergy }),
      setSearchedWord: (searchedWord) => set({ searchedWord }),
    }),
    {
      name: "app-storage",
    }
  )
);
