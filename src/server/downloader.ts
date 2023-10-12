import "server-only";
import { Queue } from "bullmq";
import connection from "../workers/downloader/core/connection";

export type DownloadData = null;

const queue = new Queue<DownloadData>("music:download", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

export async function requestDownload(videoId: string) {
  queue.add(videoId, null, { jobId: videoId });
}
