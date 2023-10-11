import "client-only";
import { createContext } from "react";
import { type Socket, io } from "socket.io-client";
import type { Song } from "~/redux/features/library";

export interface ServerToClientEvents {
  "music:download:progress": (videoId: string, percentage: number) => void,
  "music:download:finish": (track: Song) => void,
  "music:download:cancel": (videoId: string) => void,
}

export interface ClientToServerEvents {
  "dummy": () => void,
}

export function createConnection() {
  return io();
}

export type JukeSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const SocketContext = createContext<JukeSocket | null>(null);
