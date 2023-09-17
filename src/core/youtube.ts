import fs from "node:fs/promises";
import path from "path";
import YoutubeMp3Downloader from "youtube-mp3-downloader";
import { getRecords, saveRecord } from "./db";
import io from "./socket";
import { getVideoIdsFromPlaylist } from "./youtube-api";
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
        const records = await getRecords("track:" + videoId);
        const rawData = records["track:" + videoId];
        if (!rawData) {
          await fs.unlink(path.join(downloadsFolder, videoId + ".mp3"));
          throw new Error("Track is downloaded but its metadata is missing! " + videoId);
        }
        const track: TrackData = JSON.parse(rawData);
        io.emit("music:download:subscription:remove", track);
      } else {
        await downloadYoutubeVideo(videoId);
        console.log(videoId + " has been downloaded. " + downloadQueue.length + " left.");
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

export async function requestDownload(url: string, youtubeToken: string | null): Promise<string[]> {
  try {
    const playlistId = getPlaylistId(url);
    if (playlistId) {
      if (!youtubeToken) throw new Error("Youtube Access Token is not provided.");
      const videoIds = await getVideoIdsFromPlaylist(playlistId, youtubeToken);
      for (const videoId of videoIds) {
        downloadQueue.push(videoId);
      }
      return videoIds;
    } else {
      const videoId = getVideoId(url);
      if (!videoId) throw new Error("Invalid Youtube URL");
      downloadQueue.push(videoId);
      return [videoId];
    }
  } catch {
    return [];
  }
}

function getPlaylistId(url: string): string | null {
  const regExp = /[?&]list=([^#?&]*)/;
  const match = url.match(regExp);
  return (match && match[1]) ? match[1] : null;
}

function getVideoId(url: string): string | null {
  const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = regex.exec(url);
  return (match && match[7]) ? match[7] : null;
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
