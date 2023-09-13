import { createContext } from "react";
import { type Socket, io } from "socket.io-client";

function getSocketHost(): string {
  return (process.env.NODE_ENV === "production" ? undefined : "http://localhost:7701") as string;
}

export function createConnection() {
  return io(getSocketHost());
}

export const SocketContext = createContext<Socket | null>(null);
