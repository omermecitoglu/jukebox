import { useEffect } from "react";
import useNavigatorOnLine from "~/hooks/useNavigatorOnLine";
import { activate } from "~/redux/features/app";
import { useAppDispatch } from "~/redux/hooks";

const Updater = () => {
  const isOnline = useNavigatorOnLine();
  const dispatch = useAppDispatch();
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
        dispatch(activate());
      }
    })();
  }, []);
  return null;
};

export default Updater;
