import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DrugProps, ScheduleItem } from "../types/dashboard";
import { AppType, Info } from "../utils/store";

const initialState: AppType = {
  info: [{ name: "", phone: "", email: "" }],
  drugs: [],
  schedule: [],
  allergies: [],
  drugDetails: [],
  activeAllergy: "",
  completedDrugs: [],
  profilePicture: '',
  otcDrugs: '',
  herbs: ''
};

const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    setDrugs: (state, action: PayloadAction<DrugProps[]>) => {
      state.drugs = action.payload;
    },
    updateSchedule: (state, action: PayloadAction<ScheduleItem[]>) => {
      state.schedule = action.payload;
    },
     updateOtcDrugs: (state, action: PayloadAction<string>) => {
      state.otcDrugs = action.payload;
    },
     updateHerbs: (state, action: PayloadAction<string>) => {
      state.herbs = action.payload;
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
    updateProfilePicture: (state, action: PayloadAction<string>) => {
      state.profilePicture = action.payload;
    },
  },
});

export default stateSlice.reducer;
export const {
  setDrugs,
  updateSchedule,
  updateInfo,
  updateAllergies,
  updateDrugDetails,
  updateActiveAllergy,
  updateCompletedDrugs,
  updateProfilePicture,
  updateHerbs,
  updateOtcDrugs
} = stateSlice.actions;