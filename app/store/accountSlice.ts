import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserResponse, SessionResponse } from "~/services/users.service";
import {
  type AccountResponse,
  getMyAccounts,
} from "~/services/account.service";
import { type ChannelResponse, listChannels } from "~/services/channel.service";
import type { AppThunk } from "~/store/store";

export type Account = {
  account: AccountResponse;
};

export type Channels = {
  channels: ChannelResponse[];
};

type AccountState = {
  account: Account | null;
  channels: Channels | null;
};

const initialState: AccountState = {
  account: null,
  channels: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount(state, action: PayloadAction<Account>) {
      state.account = action.payload;
    },
    removeAccount(state) {
      state.account = null;
    },
    setChannels(state, action: PayloadAction<Channels>) {
      state.channels = action.payload;
    },
    removeChannel(state) {
      state.channels = null;
    },
  },
});

export const loadAccount =
  (force = false): AppThunk =>
  async (dispatch, getState) => {
    const { account } = getState().account;

    if (!force && account) {
      return;
    }

    const accounts = await getMyAccounts();
    if (accounts?.length) {
      dispatch(setAccount({ account: accounts[0] }));
    }
    return;
  };

export const loadChannels =
  (force = false): AppThunk =>
  async (dispatch, getState) => {
    let { account } = getState().account;

    if (!account) {
      await dispatch(loadAccount());

      account = getState().account.account;
      if (!account) {
        throw new Error("Failed to load account.");
      }
    }

    if (!force && getState().account.channels) {
      return;
    }

    const channels = await listChannels(account.account.id);

    dispatch(
      setChannels({
        channels,
      }),
    );
  };

export const { setAccount, removeAccount, setChannels, removeChannel } =
  accountSlice.actions;
export default accountSlice.reducer;
