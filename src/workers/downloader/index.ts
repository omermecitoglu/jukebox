import { UnrecoverableError, Worker } from "bullmq";
import connection from "./core/connection";
import { addToList } from "./core/db";
import { getDownloadsPath, makeSureDownloadsFolderExists } from "./core/storage";
import { fetchTrack } from "./core/track";
import type { DownloadData } from "./api";

const worker = new Worker<DownloadData>("music:download", async job => {
  try {
    const track = await fetchTrack(job.name, getDownloadsPath(), p => job.updateProgress(p));
    return JSON.stringify(track);
  } catch (error) {
    if (error instanceof Error && error.message.endsWith("is too long!")) {
      // video is too long. skip!
      addToList("blacklist", job.name);
      throw new UnrecoverableError("Unrecoverable");
    }
    if (typeof error === "string" && error.includes("ffmpeg exited with code 1:")) {
      // ffmpeg error. skip!
      addToList("blacklist", job.name);
      throw new UnrecoverableError("Unrecoverable");
    }
    console.log("Exception!!!");
    console.error(error);
    throw error;
  }
}, {
  connection,
  autorun: false,
});

(async () => {
  await makeSureDownloadsFolderExists();
  console.log("the worker has started running.");
  worker.run();
})();

worker.on("error", console.error);

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
