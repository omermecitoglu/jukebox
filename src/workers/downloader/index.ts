import { Worker } from "bullmq";
import Redis from "ioredis";
import connection from "./core/connection";
import { getDownloadsPath, makeSureDownloadsFolderExists } from "./core/storage";
import { downloadTrack } from "./core/youtube";
import type { DownloadData } from "./api";

const redis = new Redis();

const worker = new Worker<DownloadData>("Download", async job => {
  return await downloadTrack(job.name, getDownloadsPath(), job.updateProgress.bind(job));
}, {
  connection,
  autorun: false,
});

(async () => {
  await makeSureDownloadsFolderExists();
  console.log("the worker has started running.");
  worker.run();
})();

worker.on("progress", (job, progress) => {
  console.log(job.name, progress);
});

worker.on("completed", (job, track) => {
  redis.set("track:" + job.name, JSON.stringify(track));
});

worker.on("failed", (job, error: unknown) => {
  console.log("failed");
  if (!job) {
    console.log("???");
    console.error(error);
  } else if (error instanceof Error && error.message.endsWith("is too long!")) {
    // video is too long. skip!
    redis.sadd("blacklist", [job.name]);
  } else if (typeof error === "string" && error.includes("ffmpeg exited with code 1:")) {
    // ffmpeg error. skip!
    redis.sadd("blacklist", [job.name]);
  } else {
    console.log("!!!");
    console.error(error);
  }
});

worker.on("error", err => {
  console.log("errored");
  // log the error
  console.error(err);
});

let isShuttingDown = false;
const gracefulShutdown = async (code: NodeJS.Signals) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log("\nGracefully shutting the worker down...");
  try {
    await worker.close();
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(parseInt(code));
  }
};

process.on("SIGINT", (c) => gracefulShutdown(c));
process.on("SIGHUP", (c) => gracefulShutdown(c));
process.on("SIGQUIT", (c) => gracefulShutdown(c));
process.on("SIGTERM", (c) => gracefulShutdown(c));
if (process.platform === "win32") {
  process.on("SIGKILL", (c) => gracefulShutdown(c));
}
