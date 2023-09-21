import fs from "node:fs/promises";
import path from "path";
import YoutubeMp3Downloader from "youtube-mp3-downloader";
import { saveRecord } from "./db";
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

export function getPlaylistId(url: string): string | null {
  const regExp = /[?&]list=([^#?&]*)/;
  const match = url.match(regExp);
  return (match && match[1]) ? match[1] : null;
}

export function getVideoId(url: string): string | null {
  const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = regex.exec(url);
  return (match && match[7]) ? match[7] : null;
}

export function downloadYoutubeVideo(downloadsFolder: string, videoId: string): Promise<FinishedDownloadData> {
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

      saveRecord("track:" + data.videoId, JSON.stringify(track)).catch(console.error);

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
