import React, { type ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { activate } from "./features/app";
import { persistor, store } from "./store";

type ReduxProviderProps = {
  children: ReactNode,
};

const ReduxProvider = ({
  children,
}: ReduxProviderProps) => {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
        .then(() => store.dispatch(activate()))
        .catch(console.error);
    } else {
      store.dispatch(activate());
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
