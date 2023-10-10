import createSocketServer from "~/server/socket";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocketHandler = (req: any, res: any) => {
  if (!res.socket.server.io) {
    res.socket.server.io = createSocketServer(res.socket.server);
    console.log("Socket server has started running.");
  }
  res.end();
};

export default SocketHandler;
