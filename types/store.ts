export type AppState = {
  isAuthenticated: boolean;
  userId: string;

  activeTab: string;
  activeDrug: string;
  activeDrugId: string;
  activeAllergy: string;
  searchedWord: string;

  setIsAuthenticated: (v: boolean) => void;
  setUserId: (id: string) => void;

  setActiveTab: (v: string) => void;
  setActiveDrug: (v: string) => void;
  setActiveDrugId: (v: string) => void;
  setActiveAllergy: (v: string) => void;
  setSearchedWord: (v: string) => void;

};