import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import appReducer from "./features/app";
import libraryReducer from "./features/library";
import playerReducer from "./features/player";
import userReducer from "./features/user";

const persistConfig = {
  key: "jukebox",
  storage,
};

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: persistReducer(persistConfig, userReducer),
    library: persistReducer(persistConfig, libraryReducer),
    player: playerReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
