import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Song } from "./library";

interface PlayerState {
  playlist: Song[],
  currentTrack: Song | null,
}

const initialState: PlayerState = {
  playlist: [],
  currentTrack: null,
};

const player = createSlice({
  name: "player",
  initialState,
  reducers: {
    startPlaying: (state, action: PayloadAction<{ playlist: Song[], trackId: string }>) => {
      state.playlist = action.payload.playlist;
      state.currentTrack = action.payload.playlist.find(track => track.id === action.payload.trackId) ?? null;
    },
    stopPlaying: state => {
      state.playlist = [];
      state.currentTrack = null;
    },
    playPrevSong: state => {
      const index = state.playlist.findIndex(t => t.id === state.currentTrack?.id);
      state.currentTrack = state.playlist[(state.playlist.length + (index - 1)) % state.playlist.length];
    },
    playNextSong: state => {
      const index = state.playlist.findIndex(t => t.id === state.currentTrack?.id);
      state.currentTrack = state.playlist[(index + 1) % state.playlist.length];
    },
  },
});

export const { startPlaying, stopPlaying, playPrevSong, playNextSong } = player.actions;

export default player.reducer;
