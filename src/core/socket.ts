import { createServer } from "node:http";
import path from "path";
import express from "express";
import { Server } from "socket.io";
import type { TrackData } from "./track";

interface ServerToClientEvents {
  "music:download:subscription:add": (videoId: string) => void,
  "music:download:subscription:remove": (track: TrackData) => void,
  "music:download:subscription:progress": (videoId: string, percentage: number) => void,
}

interface ClientToServerEvents {
  "music:download:start": (input: string) => void,
}

const app = express();
const server = createServer(app);
const io = new Server <ClientToServerEvents, ServerToClientEvents>(server, {
  cors: (process.env.NODE_ENV === "production") ? undefined : {
    origin: "http://localhost:7700",
  },
});

const clientFolder = path.join(process.cwd(), "../client/build");
app.use(express.static(clientFolder));

const downloadsFolder = path.join(process.cwd(), "downloads");
app.use(express.static(downloadsFolder));

const serverPort = process.env.NODE_ENV === "production" ? 7700 : 7701;

server.listen(serverPort, () => {
  console.log("server running at http://localhost:" + serverPort);
});

export default io;
