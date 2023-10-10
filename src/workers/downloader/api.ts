import "server-only";
import { Queue } from "bullmq";
import connection from "./core/connection";

export type DownloadData = null;

const queue = new Queue<DownloadData>("Download", { connection });

export async function requestDownload(videoId: string) {
  queue.add(videoId, null, { jobId: videoId });
}
