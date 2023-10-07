import "client-only";

import { createContext } from "react";
import { type Socket, io } from "socket.io-client";
import type { Song } from "~/redux/features/library";
import { getHost } from "./host";

interface ServerToClientEvents {
  "music:download:subscription:add": (videoId: string) => void,
  "music:download:subscription:progress": (videoId: string, percentage: number) => void,
  "music:download:finish": (song: Song) => void,
  "music:download:cancel": (videoId: string) => void,
}

interface ClientToServerEvents {
  "music:download:request": (input: string, youtubeToken: string | null) => void,
  "music:download:subscribe": (videoIds: string[]) => void,
}

export function createConnection() {
  return io(getHost());
}

export type JukeSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const SocketContext = createContext<JukeSocket | null>(null);
