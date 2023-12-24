import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppType } from "../utils/store";
import { Info } from "../utils/store";

const initialState: AppType = {
  info: [{name: '', phone: '', email: '', role: ''}],
  isAuthenticated: false,
  userId: "",
  drugs: [],
  effects: [],
  schedule: [],
  activeDrug: "",
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
    updateIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    updateUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    updateInfo: (state, action: PayloadAction<Info[]>) =>{
      state.info = action.payload
    }
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
  updateInfo
} = stateSlice.actions;
