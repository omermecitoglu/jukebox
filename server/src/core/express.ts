import { createServer } from "node:http";
import path from "path";
import express from "express";

const app = express();
const server = createServer(app);

const clientFolder = path.join(process.cwd(), "../client/build");
app.use(express.static(clientFolder));

const downloadsFolder = path.join(process.cwd(), "downloads");
app.use(express.static(downloadsFolder, {
  setHeaders: (res) => {
    res.set("Accept-Ranges", "none");
  },
}));

export default server;
