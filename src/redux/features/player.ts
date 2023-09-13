import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Song } from "./library";

interface PlayerState {
  isPlaying: boolean,
  playlist: Song[],
  currentTrack: string | null,
}

const initialState: PlayerState = {
  isPlaying: false,
  playlist: [],
  currentTrack: null,
};

const player = createSlice({
  name: "player",
  initialState,
  reducers: {
    startPlaying: (state, action: PayloadAction<Partial<PlayerState>>) => {
      state.isPlaying = true;
      state.playlist = action.payload.playlist ?? [];
      state.currentTrack = action.payload.currentTrack ?? null;
    },
    stopPlaying: state => {
      state.isPlaying = false;
      state.playlist = [];
      state.currentTrack = null;
    },
    playNextSong: state => {
      const index = state.playlist.findIndex(t => t.id === state.currentTrack);
      state.currentTrack = state.playlist[(index + 1) % state.playlist.length].id;
    },
  },
});

export const { startPlaying, stopPlaying, playNextSong } = player.actions;

export default player.reducer;
