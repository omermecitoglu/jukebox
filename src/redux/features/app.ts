import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AppState {
  active: boolean,
  cachedSongs: string[],
  cacheLoaded: boolean,
  prospectSong: string | null,
}

const initialState: AppState = {
  active: false,
  cachedSongs: [],
  cacheLoaded: false,
  prospectSong: null,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    activate: state => {
      state.active = true;
    },
    addCachedSongs: (state, action: PayloadAction<string[]>) => {
      state.cachedSongs = Array.from(new Set([...state.cachedSongs, ...action.payload]));
      state.cacheLoaded = true;
    },
    cacheSong: (state, action: PayloadAction<string | null>) => {
      state.prospectSong = action.payload;
    },
  },
});

export const { activate, addCachedSongs, cacheSong } = user.actions;

export default user.reducer;
