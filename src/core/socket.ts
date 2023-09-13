import io from "socket.io-client";

const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:7701";

export const socket = io(URL as string);
