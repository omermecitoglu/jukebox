import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface PlayerState {
  accessToken: string | null,
  accessTokenExpiration: number,
}

const initialState: PlayerState = {
  accessToken: null,
  accessTokenExpiration: 0,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    injectAccessToken: (state, action: PayloadAction<Partial<PlayerState>>) => {
      state.accessToken = action.payload.accessToken ?? null;
      state.accessTokenExpiration = action.payload.accessTokenExpiration ?? 0;
    },
    deleteAccessToken: state => {
      state.accessToken = null;
      state.accessTokenExpiration = 0;
    },
  },
});

export const { injectAccessToken, deleteAccessToken } = user.actions;

export default user.reducer;
