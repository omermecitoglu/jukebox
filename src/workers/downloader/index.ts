import { UnrecoverableError, Worker } from "bullmq";
import connection from "./core/connection";
import { addToList } from "./core/db";
import { getDownloadsPath, makeSureDownloadsFolderExists } from "./core/storage";
import { fetchTrack } from "./core/track";
import type { DownloadData } from "../../server/downloader";

const worker = new Worker<DownloadData>("music:download", async job => {
  try {
    return JSON.stringify(await fetchTrack(job.name, getDownloadsPath(), p => job.updateProgress(p)));
  } catch (error) {
    if (error instanceof UnrecoverableError) {
      addToList("blacklist", job.name);
    }
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
