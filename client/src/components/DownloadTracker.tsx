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

    const handleFinishedDownload = (song: Song) => {
      dispatch(removeDownload(song.id));
      dispatch(addSong(song));
      sendNotification("Download Complete", song.title + " has been downloaded.");
    };

    const handleCancelledDownload = (videoId: string) => {
      dispatch(removeDownload(videoId));
      sendNotification("Download Error", "This video is too long!");
    };

    socket.emit("music:download:subscribe", subscriptions);
    socket.on("music:download:finish", handleFinishedDownload);
    socket.on("music:download:cancel", handleCancelledDownload);

    return () => {
      socket.off("music:download:finish", handleFinishedDownload);
      socket.off("music:download:cancel", handleCancelledDownload);
    };
  }, [socket]);

  return <></>;
};

export default DownloadTracker;
