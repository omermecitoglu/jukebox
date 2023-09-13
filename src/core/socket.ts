import { createContext } from "react";
import { type Socket, io } from "socket.io-client";
import type { Song } from "~/redux/features/library";

interface ServerToClientEvents {
  "music:download:subscription:add": (videoId: string) => void,
  "music:download:subscription:remove": (song: Song) => void,
  "music:download:subscription:progress": (videoId: string, percentage: number) => void,
}

interface ClientToServerEvents {
  "music:download:start": (input: string) => void,
}

function getSocketHost(): string {
  return (process.env.NODE_ENV === "production" ? undefined : "http://localhost:7701") as string;
}

export function createConnection() {
  return io(getSocketHost());
}

export type JukeSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const SocketContext = createContext<JukeSocket | null>(null);
