import { requestDownload } from "~/core/downloader";
import io from "~/core/socket";

io.on("connection", (socket) => {
  socket.on("music:download:subscribe", async (videoIds: string[]) => {
    for (const videoId of videoIds) {
      socket.join("download:subscriber:" + videoId);
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      await requestDownload(url, null);
    }
  });
  socket.on("music:download:request", async (input: string, youtubeToken: string | null) => {
    const videoIds = await requestDownload(input, youtubeToken);
    for (const videoId of videoIds) {
      socket.join("download:subscriber:" + videoId);
      socket.emit("music:download:subscription:add", videoId);
    }
  });
});
