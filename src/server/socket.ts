import { QueueEvents } from "bullmq";
import { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "~/core/socket";
import type { Song } from "~/redux/features/library";
import connection from "~/workers/downloader/core/connection";

export default function createSocketServer(server: number) {
  const queueEvents = new QueueEvents("music:download", { connection });
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);
  queueEvents.on("progress", ({ jobId, data }) => {
    if (typeof data === "number") {
      io.to("download:subscriber:" + jobId)
        .emit("music:download:progress", jobId, data);
    }
  });
  queueEvents.on("completed", ({ returnvalue }) => {
    const track = JSON.parse(returnvalue) as Song;
    io.to("download:subscriber:" + track.id)
      .emit("music:download:finish", track);
  });
  queueEvents.on("retries-exhausted", ({ jobId }) => {
    io.to("download:subscriber:" + jobId)
      .emit("music:download:cancel", jobId);
  });
  io.on("connection", socket => {
    socket.on("subscribe", (subscriptions) => {
      for (const videoId of subscriptions) {
        socket.join("download:subscriber:" + videoId);
      }
      const oldRooms = Array.from(socket.rooms).filter(r => r.startsWith("download:subscriber"));
      const newRooms = subscriptions.map(s => "download:subscriber:" + s);
      for (const room of oldRooms) {
        if (!newRooms.includes(room)) {
          socket.leave(room);
        }
      }
    });
  });
  return io;
}
