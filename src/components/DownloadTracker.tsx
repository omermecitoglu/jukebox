import React, { useContext, useEffect } from "react";
import { sendNotification } from "~/core/notifications";
import { SocketContext } from "~/core/socket";
import { type Song, addSong, removeDownload, updateDownloadProgress } from "~/redux/features/library";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

const DownloadTracker = () => {
  const socket = useContext(SocketContext);
  const subscriptions = useAppSelector(state => state.library.downloads);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;
    const init = () => {
      socket.emit("subscribe", subscriptions.map(s => s.videoId));
    };
    socket.on("connect", init);
    return () => {
      socket.off("connect", init);
    };
  }, [socket]);

  useEffect(() => {
    if (socket?.connected) {
      socket.emit("subscribe", subscriptions.map(s => s.videoId));
    }
  }, [subscriptions]);

  useEffect(() => {
    if (!socket) return;

    const handleProgress = (videoId: string, percentage: number) => {
      dispatch(updateDownloadProgress({
        videoId,
        progress: percentage,
      }));
    };

    const handleFinish = (track: Song) => {
      dispatch(removeDownload(track.id));
      dispatch(addSong(track));
      sendNotification("Download Complete", track.title + " has been downloaded.");
    };

    const handleCancel = (videoId: string) => {
      dispatch(removeDownload(videoId));
      sendNotification("Download Error", "This video is too long!");
    };

    socket.on("music:download:progress", handleProgress);
    socket.on("music:download:finish", handleFinish);
    socket.on("music:download:cancel", handleCancel);

    return () => {
      socket.off("music:download:progress", handleProgress);
      socket.off("music:download:finish", handleFinish);
      socket.off("music:download:cancel", handleCancel);
    };
  }, [socket]);

  return <></>;
};

export default DownloadTracker;
