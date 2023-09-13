import { createServer } from "node:http";
import path from "path";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: (process.env.NODE_ENV === "production") ? undefined : {
    origin: "http://localhost:7700",
  },
});

const clientFolder = path.join(__dirname, "client");
app.use(express.static(clientFolder));

const downloadsFolder = path.join(process.cwd(), "downloads");
app.use(express.static(downloadsFolder));

const serverPort = process.env.NODE_ENV === "production" ? 7700 : 7701;

server.listen(serverPort, () => {
  console.log("server running at http://localhost:" + serverPort);
});

export default io;
