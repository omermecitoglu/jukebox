import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import type { Download } from "~/redux/features/library";

type DownloadSubscriptionProps = {
  download: Download,
};

const DownloadSubscription = ({
  download,
}: DownloadSubscriptionProps) => (
  <div>
    <div className="lh-sm">{download.videoId}</div>
    <ProgressBar animated now={download.progress} className="border border-primary" />
  </div>
);

export default DownloadSubscription;
