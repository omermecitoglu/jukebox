import { Server } from "socket.io";
import httpServer from "./express";
import type { TrackData } from "./youtube/track";

interface ServerToClientEvents {
  "music:download:subscription:add": (videoId: string) => void,
  "music:download:subscription:progress": (videoId: string, percentage: number) => void,
  "music:download:finish": (track: TrackData) => void,
  "music:download:cancel": (videoId: string) => void,
}

interface ClientToServerEvents {
  "music:download:request": (input: string, youtubeToken: string | null) => void,
  "music:download:subscribe": (videoIds: string[]) => void,
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
