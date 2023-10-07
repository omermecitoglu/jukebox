import React, { useContext, useEffect, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { SocketContext } from "~/core/socket";

type DownloadSubscriptionProps = {
  downloadId: string,
};

const DownloadSubscription = ({
  downloadId,
}: DownloadSubscriptionProps) => {
  const socket = useContext(SocketContext);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const handleProgress = (videoId: string, p: number) => {
      if (downloadId === videoId) {
        setPercentage(p);
      }
    };

    if (socket) {
      socket.on("music:download:subscription:progress", handleProgress);
    }

    return () => {
      if (socket) {
        socket.off("music:download:subscription:progress", handleProgress);
      }
    };
  }, [downloadId, socket]);

  return (
    <div>
      <div className="lh-sm">{downloadId}</div>
      <ProgressBar animated now={percentage} className="border border-primary" />
    </div>
  );
};

export default DownloadSubscription;
