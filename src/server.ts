import io from "./core/socket";
import { startDownload } from "./core/youtube";

io.on("connection", (socket) => {
  socket.on("music:download:start", (input: string) => {
    const videoId = startDownload(input);
    if (videoId) {
      socket.emit("music:download:subscription:add", videoId);
    }
  });
});
