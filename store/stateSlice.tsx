import { Effect } from "@/Layout/dashboard/home/Reports";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DrugProps, ScheduleItem } from "../types/dashboard";
import { AppType, Info } from "../utils/store";

const initialState: AppType = {
  info: [{ name: "", phone: "", email: "", otcDrugs: "", herbs: "" }],
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
  completedDrugs: [],
  confetti: false,
  profilePicture: [],
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
    updateConfetti: (state, action: PayloadAction<boolean>) => {
      state.confetti = action.payload;
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
    updateAllergies: (state, action: PayloadAction<DrugProps[]>) => {
      state.allergies = action.payload;
    },
    updateDrugDetails: (state, action: PayloadAction<DrugProps[]>) => {
      state.drugDetails = action.payload;
    },
    updateCompletedDrugs: (state, action: PayloadAction<DrugProps[]>) => {
      state.completedDrugs = action.payload;
    },
    updateProfilePicture: (state, action: PayloadAction<any>) => {
      state.profilePicture = action.payload;
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
  updateActive,
  updateCompletedDrugs,
  updateConfetti,
  updateProfilePicture,
} = stateSlice.actions;
