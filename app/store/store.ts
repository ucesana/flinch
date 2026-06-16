import { configureStore } from "@reduxjs/toolkit";
import identityReducer from "./identitySlice";

export const store = configureStore({
  reducer: {
    session: identityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
