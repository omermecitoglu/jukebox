import fs from "node:fs/promises";
import path from "path";
import YoutubeMp3Downloader from "youtube-mp3-downloader";
import io from "./socket";
import type { TrackData } from "./track";

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

const downloadsFolder = path.join(process.cwd(), "downloads");

const downloadQueue: string[] = [];

async function runQueue() {
  const videoId = downloadQueue.shift();
  if (videoId) {
    try {
      const exists = await checkSongExists(videoId);
      if (exists) {
        // retrieve track data from db!
      } else {
        const data = await downloadYoutubeVideo(videoId);
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      downloadQueue.push(videoId);
      await sleep(1000);
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

async function checkSongExists(videoId: string) {
  try {
    await fs.access(path.join(downloadsFolder, videoId + ".mp3"));
    return true;
  } catch {
    return false;
  }
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

function downloadYoutubeVideo(videoId: string): Promise<FinishedDownloadData> {
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
      fs.rename(data.file, path.join(downloadsFolder, videoId + ".mp3"))
        .catch(err => console.error(`Error renaming file: ${err}`));

      resolve(data);

      const track: TrackData = {
        id: data.videoId,
        artist: data.artist,
        title: data.title,
      };

      // save track data to database!

      io.emit("music:download:subscription:remove", track);
    });

    downloader.on("error", function(error) {
      reject(error);
    });

    downloader.on("progress", function(data) {
      io.to("download:subscriber:" + data.videoId).emit("music:download:subscription:progress", data.videoId, data.progress.percentage);
    });
  });
}
