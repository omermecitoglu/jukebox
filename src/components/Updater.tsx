import { useEffect } from "react";
import useInquiry from "~/hooks/useInquiry";
import useNavigatorOnLine from "~/hooks/useNavigatorOnLine";
import { activate } from "~/redux/features/app";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

const Updater = () => {
  const isOnline = useNavigatorOnLine();
  const subscriptions = useAppSelector(state => state.library.downloads);
  const [inquire] = useInquiry();
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      try {
        if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.register("/sw.js");
          const cacheList = await caches.keys();
          const versions = cacheList.filter(c => /^v\d+\.\d+\.\d+\.\w+$/.test(c));
          if (versions.length) {
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
        }
        if (isOnline) {
          await fetch("/api/socket");
        }
        if (subscriptions.length) {
          await inquire(subscriptions.map(d => d.videoId).join(","), true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(activate());
      }
    })();
  }, []);
  return null;
};

export default Updater;
