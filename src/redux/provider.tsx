import React, { type ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import useNavigatorOnLine from "~/hooks/useNavigatorOnLine";
import { activate } from "./features/app";
import { persistor, store } from "./store";

type ReduxProviderProps = {
  children: ReactNode,
};

const ReduxProvider = ({
  children,
}: ReduxProviderProps) => {
  const isOnline = useNavigatorOnLine();
  useEffect(() => {
    (async () => {
      try {
        if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.register("/sw.js");
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed") {
                alert("Application has been updated!");
                window.location.reload();
              }
            });
          });
        }
        if (isOnline) {
          await fetch("/api/socket");
        }
      } finally {
        store.dispatch(activate());
      }
    })();
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
