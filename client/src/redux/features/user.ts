import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface PlayerState {
  accessToken: string | null,
}

const initialState: PlayerState = {
  accessToken: null,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    injectAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { injectAccessToken } = user.actions;

export default user.reducer;
