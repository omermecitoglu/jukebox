import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Song = {
  id: string,
  artist: string,
  title: string,
};

interface LibraryState {
  songs: Song[],
  downloads: string[],
}

const initialState: LibraryState = {
  songs: [],
  downloads: [],
};

const library = createSlice({
  name: "library",
  initialState,
  reducers: {
    addSong: (state, action: PayloadAction<Song>) => {
      state.songs = Array.from(new Set([...state.songs, action.payload]));
    },
    removeSong: (state, action: PayloadAction<string>) => {
      state.songs = state.songs.filter(s => s.id !== action.payload);
    },
    addDownload: (state, action: PayloadAction<string>) => {
      state.downloads = Array.from(new Set([...state.downloads, action.payload]));
    },
    removeDownload: (state, action: PayloadAction<string>) => {
      state.downloads = state.downloads.filter(s => s !== action.payload);
    },
  },
});

export const { addSong, addDownload, removeDownload } = library.actions;

export default library.reducer;
