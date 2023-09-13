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
    const handleProgress = (p: number) => {
      setPercentage(p);
    };

    if (socket) {
      socket.on("music:download:subscription:progress:" + downloadId, handleProgress);
    }

    return () => {
      if (socket) {
        socket.off("music:download:subscription:progress:" + downloadId, handleProgress);
      }
    };
  }, [downloadId]);

  return <ProgressBar key={downloadId} animated now={percentage} />;
};

export default DownloadSubscription;
