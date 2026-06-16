import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AccountResponse,
  SessionResponse,
} from "~/services/account.service";

export type Identity = {
  account: AccountResponse;
  session: SessionResponse;
};

type IdentityState = {
  identity: Identity | null;
};

const initialState: IdentityState = {
  identity: null,
};

const identitySlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setIdentity(state, action: PayloadAction<Identity>) {
      state.identity = action.payload;
    },
    removeIdentity(state) {
      state.identity = null;
    },
  },
});

export const { setIdentity, removeIdentity } = identitySlice.actions;
export default identitySlice.reducer;
