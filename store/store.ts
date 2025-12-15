import { configureStore } from "@reduxjs/toolkit";
import earthquakeReducer from "./slices/earthquakeSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    earthquakes: earthquakeReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
