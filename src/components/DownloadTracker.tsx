import React, { useContext, useEffect } from "react";
import { sendNotification } from "~/core/notifications";
import { SocketContext } from "~/core/socket";
import { type Song, addSong, removeDownload } from "~/redux/features/library";
import { useAppDispatch } from "~/redux/hooks";

const DownloadTracker = () => {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleCompletedDownload = (song: Song) => {
      dispatch(removeDownload(song.id));
      dispatch(addSong(song));
      sendNotification("Download Complete", song.title + " has been downloaded.");
    };

    socket.on("music:download:complete", handleCompletedDownload);

    return () => {
      socket.off("music:download:complete", handleCompletedDownload);
    };
  }, [socket]);

  return <></>;
};

export default DownloadTracker;
