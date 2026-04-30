import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  userId: string;
  isAuthenticated: boolean;
  activeTab: string;
  activeDrug: string;
  activeDrugId: string;
  activeAllergy: string;
  searchedWord: string;
}

const initialState: AppState = {
  userId: "",
  isAuthenticated: false,
  activeTab: "Dashboard",
  activeDrug: "",
  activeDrugId: "",
  activeAllergy: "",
  searchedWord: "",
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setActiveDrug: (state, action: PayloadAction<string>) => {
      state.activeDrug = action.payload;
    },
    setActiveDrugId: (state, action: PayloadAction<string>) => {
      state.activeDrugId = action.payload;
    },
    setActiveAllergy: (state, action: PayloadAction<string>) => {
      state.activeAllergy = action.payload;
    },
    setSearchedWord: (state, action: PayloadAction<string>) => {
      state.searchedWord = action.payload;
    },
  },
});

export const {
  setUserId,
  setIsAuthenticated,
  setActiveTab,
  setActiveDrug,
  setActiveDrugId,
  setActiveAllergy,
  setSearchedWord,
} = appSlice.actions;

export default appSlice.reducer;
