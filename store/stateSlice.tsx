import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Info } from "../utils/store";
import { AppType } from "../utils/store";
import { DrugProps, ScheduleItem } from "../types/dashboard";
import { Effect } from "@/Layout/dashboard/home/DailyReports";
import { AllergicItemProps } from "../types/dashboardDrugs";

const initialState: AppType = {
  info: [{ name: "", phone: "", email: "", role: "", otcDrugs: '', herbs: '' }],
  isAuthenticated: true,
  userId: "",
  drugs: [],
  effects: [],
  schedule: [],
  activeDrug: "",
  allergies: [],
  searchedWord: "",
  drugDetails: [],
  activeAllergy: "",
  active: "Home",
  completedDrugs:[]
};

const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    setDrugs: (state, action: PayloadAction<DrugProps[]>) => {
      state.drugs = action.payload;
    },
    setEffects: (state, action: PayloadAction<Effect[]>) => {
      state.effects = action.payload;
    },
    updateActiveDrug: (state, action: PayloadAction<string>) => {
      state.activeDrug = action.payload;
    },
    updateSchedule: (state, action: PayloadAction<ScheduleItem[]>) => {
      state.schedule = action.payload;
    },
    updateIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    updateUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    updateActive: (state, action: PayloadAction<string>) => {
      state.active = action.payload;
    },
    updateSearchedWord: (state, action: PayloadAction<string>) => {
      state.searchedWord = action.payload;
    },
    updateActiveAllergy: (state, action: PayloadAction<string>) => {
      state.activeAllergy = action.payload;
    },
    updateInfo: (state, action: PayloadAction<Info[]>) => {
      state.info = action.payload;
    },
    updateAllergies: (state, action: PayloadAction<AllergicItemProps[]>) => {
      state.allergies = action.payload;
    },
    updateDrugDetails: (state, action: PayloadAction<DrugProps[]>) => {
      state.drugDetails = action.payload;
    },
    updateCompletedDrugs: (state, action: PayloadAction<DrugProps[]>) => {
      state.completedDrugs = action.payload;
    },
  },
});

export default stateSlice.reducer;
export const {
  setDrugs,
  setEffects,
  updateActiveDrug,
  updateSchedule,
  updateIsAuthenticated,
  updateUserId,
  updateInfo,
  updateAllergies,
  updateSearchedWord,
  updateDrugDetails,
  updateActiveAllergy,
  updateActive, updateCompletedDrugs
} = stateSlice.actions;
