import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  active: boolean,
}

const initialState: AppState = {
  active: false,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    activate: state => {
      state.active = true;
    },
  },
});

export const { activate } = user.actions;

export default user.reducer;
