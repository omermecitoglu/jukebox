import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { deleteMusicCache } from "~/core/cache";

export type Song = {
  id: string,
  artist: string,
  title: string,
  thumbnail: string,
};

export type Download = {
  videoId: string,
  progress: number,
};

interface LibraryState {
  songs: Song[],
  downloads: Download[],
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
      const found = state.songs.find(s => s.id === action.payload.id);
      state.songs = found ? state.songs : [...state.songs, action.payload];
    },
    removeSong: (state, action: PayloadAction<string>) => {
      deleteMusicCache(action.payload);
      state.songs = state.songs.filter(s => s.id !== action.payload);
    },
    addDownload: (state, action: PayloadAction<string>) => {
      const found = state.downloads.find(d => d.videoId === action.payload);
      state.downloads = found ? state.downloads : [...state.downloads, { videoId: action.payload, progress: 0 }];
    },
    removeDownload: (state, action: PayloadAction<string>) => {
      state.downloads = state.downloads.filter(d => d.videoId !== action.payload);
    },
    updateDownloadProgress: (state, action: PayloadAction<Download>) => {
      state.downloads = state.downloads.map(d => d.videoId === action.payload.videoId ? action.payload : d);
    },
    clearDownloads: state => {
      state.downloads = [];
    },
  },
});

export const { addSong, removeSong, addDownload, removeDownload, updateDownloadProgress, clearDownloads } = library.actions;

export default library.reducer;
