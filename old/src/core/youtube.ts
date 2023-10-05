import fs from "node:fs";
import path from "path";
import YoutubeMp3Downloader from "youtube-mp3-downloader";
import io from "./socket";

type FinishedDownloadData = {
  videoId: string,
  stats: {
    transferredBytes: number,
    runtime: number,
    averageSpeed: number,
  },
  file: string,
  youtubeUrl: string,
  videoTitle: string,
  artist: string,
  title: string,
  thumbnail: string,
};

const downloadQueue: string[] = [];

async function runQueue() {
  const download = downloadQueue.shift();
  if (download) {
    try {
      const data = await downloadYoutubeVideo(download);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  } else {
    await sleep(1000);
  }
  runQueue();
}

runQueue();

function sleep(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

export function startDownload(url: string) {
  try {
    const videoId = getVideoId(url);
    if (!videoId) throw new Error("Invalid Youtube URL");
    downloadQueue.push(videoId);
    return videoId;
  } catch {
    return null;
  }
}

function getVideoId(url: string): string | null {
  const regex = /(?:\?v=|\/embed\/|\/v\/|\/vi\/|\/e\/|\/u\/\w+\/|\/v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/;
  const match = regex.exec(url);
  if (match && match[1]) return match[1];
  return null;
}

function downloadYoutubeVideo(videoId: string) {
  const downloadsFolder = path.join(process.cwd(), "downloads");

  return new Promise((resolve, reject) => {
    const downloader = new YoutubeMp3Downloader({
      queueParallelism: 2,
      progressTimeout: 2000,
      outputPath: downloadsFolder,
    });

    downloader.download(videoId);

    downloader.on("finished", function(err, data: FinishedDownloadData) {
      if (err) return reject(err);
      data.file;
      fs.rename(data.file, path.join(downloadsFolder, videoId + ".mp3"), (err) => {
        if (err) {
          console.error(`Error renaming file: ${err}`);
        }
      });
      resolve(JSON.stringify(data));
      io.emit("music:download:subscription:remove", {
        id: data.videoId,
        artist: data.artist,
        title: data.title,
      });
    });

    downloader.on("error", function(error) {
      reject(error);
    });

    downloader.on("progress", function(data) {
      io.emit("music:download:subscription:progress:" + data.videoId, data.progress.percentage);
    });
  });
}
