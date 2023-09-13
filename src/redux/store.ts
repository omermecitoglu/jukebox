import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";


const persistConfig = {
  key: "jukebox",
  storage,
};

export const store = configureStore({
  reducer: {
  },
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
