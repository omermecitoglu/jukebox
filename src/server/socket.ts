import { QueueEvents } from "bullmq";
import { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "~/core/socket";
import connection from "~/workers/downloader/core/connection";

export default function createSocketServer(server: number) {
  const queueEvents = new QueueEvents("music:download", { connection });
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);
  queueEvents.on("progress", ({ jobId, data }) => {
    if (typeof data === "number") {
      io.emit("music:download:progress", jobId, data);
    }
  });
  return io;
}
