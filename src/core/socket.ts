import { Server } from "socket.io";
import httpServer from "./express";
import type { TrackData } from "./track";

interface ServerToClientEvents {
  "music:download:subscription:add": (videoId: string) => void,
  "music:download:subscription:remove": (track: TrackData) => void,
  "music:download:subscription:progress": (videoId: string, percentage: number) => void,
}

interface ClientToServerEvents {
  "music:download:request": (input: string, youtubeToken: string | null) => void,
}

const io = new Server <ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: (process.env.NODE_ENV === "production") ? undefined : {
    origin: "http://localhost:7700",
  },
});

const serverPort = process.env.NODE_ENV === "production" ? 7700 : 7701;

httpServer.listen(serverPort, () => {
  console.log("server running at http://localhost:" + serverPort);
});

export default io;
