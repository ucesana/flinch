import {
  type Action,
  configureStore,
  type ThunkAction,
} from "@reduxjs/toolkit";
import identityReducer from "./identitySlice";
import accountReducer from "./accountSlice";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const store = configureStore({
  reducer: {
    session: identityReducer,
    account: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
