import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppType } from "../utils/store";
import { Drug } from "../types";

const initialState: AppType = {
  name: "John Snow",
  role: "Patient",
  email: "johnSnow@gmail.com",
  phoneNumber: "09076543212",
  drugs: [],
  effects: [],
  schedule: [],
  activeDrug: "",
  dataBase: [],
};

const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    setDrugs: (state, action: PayloadAction<any>) => {
      state.drugs = action.payload;
    },
    setEffects: (state, action: PayloadAction<any>) => {
      state.effects = action.payload;
    },
    updateActiveDrug: (state, action: PayloadAction<any>) => {
      state.activeDrug = action.payload;
    },
    updateSchedule: (state, action: PayloadAction<any>) => {
      state.schedule = action.payload;
    },
    updateDataBase: (state, action: PayloadAction<any>) => {
      state.dataBase = action.payload;
    },
  },
});

export default stateSlice.reducer;
export const {
  setDrugs,
  setEffects,
  updateActiveDrug,
  updateSchedule,
  updateDataBase,
} = stateSlice.actions;
