import React, { useContext, useEffect } from "react";
import { sendNotification } from "~/core/notifications";
import { SocketContext } from "~/core/socket";
import { type Song, addSong, removeDownload } from "~/redux/features/library";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

const DownloadTracker = () => {
  const socket = useContext(SocketContext);
  const subscriptions = useAppSelector(state => state.library.downloads);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleCompletedDownload = (song: Song) => {
      dispatch(removeDownload(song.id));
      dispatch(addSong(song));
      sendNotification("Download Complete", song.title + " has been downloaded.");
    };

    socket.emit("music:download:subscribe", subscriptions);
    socket.on("music:download:complete", handleCompletedDownload);

    return () => {
      socket.off("music:download:complete", handleCompletedDownload);
    };
  }, [socket]);

  return <></>;
};

export default DownloadTracker;
