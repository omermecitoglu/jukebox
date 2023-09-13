import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Song = {
  id: string,
  artist: string,
  title: string,
};

interface LibraryState {
  songs: Song[],
}

const initialState: LibraryState = {
  songs: [],
};

const library = createSlice({
  name: "library",
  initialState,
  reducers: {
    addSong: (state, action: PayloadAction<Song>) => {
      const found = state.songs.find(s => s.id === action.payload.id);
      if (!found) {
        state.songs = [...state.songs, action.payload];
      }
    },
    removeSong: (state, action: PayloadAction<string>) => {
      state.songs = state.songs.filter(s => s.id !== action.payload);
    },
  },
});

export const { addSong } = library.actions;

export default library.reducer;
