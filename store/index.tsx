import { configureStore } from "@reduxjs/toolkit";
import stateReducer from "./stateSlice";
import { AppType } from "../utils/store";

type RootState = {
  app: AppType;
};

const store = configureStore({
  reducer: {
    app: stateReducer,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type { RootState };
