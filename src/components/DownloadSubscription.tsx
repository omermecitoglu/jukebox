import React, { useEffect, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { socket } from "~/core/socket";

type DownloadSubscriptionProps = {
  downloadId: string,
};

const DownloadSubscription = ({
  downloadId,
}: DownloadSubscriptionProps) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const handleProgress = (p: number) => {
      setPercentage(p);
    };

    socket.on("music:download:subscription:progress:" + downloadId, handleProgress);

    return () => {
      socket.off("music:download:subscription:progress:" + downloadId, handleProgress);
    };
  }, [downloadId]);

  return <ProgressBar key={downloadId} animated now={percentage} />;
};

export default DownloadSubscription;
