import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface PlayerState {
  accessToken: string | null,
  accessTokenExpiration: number,
  picture: string,
  name: string,
  tag: string,
}

const initialState: PlayerState = {
  accessToken: null,
  accessTokenExpiration: 0,
  picture: "",
  name: "",
  tag: "",
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    injectUserProfile: (state, action: PayloadAction<{ picture: string, name: string, tag: string }>) => {
      state.picture = action.payload.picture;
      state.name = action.payload.name;
      state.tag = action.payload.tag;
    },
    injectAccessToken: (state, action: PayloadAction<{ token: string, expiration: number }>) => {
      state.accessToken = action.payload.token;
      state.accessTokenExpiration = action.payload.expiration;
    },
    deleteAccessToken: state => {
      state.accessToken = null;
      state.accessTokenExpiration = 0;
      state.picture = "";
      state.name = "";
      state.tag = "";
    },
  },
});

export const { injectUserProfile, injectAccessToken, deleteAccessToken } = user.actions;

export default user.reducer;
