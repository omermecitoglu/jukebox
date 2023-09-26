import fs from "node:fs/promises";
import path from "path";
import io from "./socket";
import { fetchTrack } from "./track";
import { sleep } from "./utils";
import { getPlaylistId, getVideoId } from "./youtube";
import { getVideoIdsFromPlaylist } from "./youtube/api-v3";

const downloadsFolder = path.join(process.cwd(), "downloads");
const downloadQueue: string[] = [];

export async function makeSureDownloadsFolderExists() {
  const targetPath = path.join(downloadsFolder, "thumbnails");
  try {
    await fs.access(targetPath);
  } catch {
    console.log("creating downloads folder...");
    await fs.mkdir(targetPath, { recursive: true });
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

function cancelDownload(videoId: string) {
  io.to("download:subscriber:" + videoId).emit("music:download:cancel", videoId);
}

export async function runQueue() {
  const videoId = downloadQueue.shift();
  if (videoId) {
    try {
      const track = await fetchTrack(videoId, downloadsFolder);
      console.log(videoId + " has been downloaded. " + downloadQueue.length + " left.");
      io.to("download:subscriber:" + videoId).emit("music:download:finish", track);
    } catch (error) {
      if (error instanceof Error && error.message.endsWith("is too long!")) {
        // video is too long. skip!
        cancelDownload(videoId);
      } else if (typeof error === "string" && error.includes("ffmpeg exited")) {
        // ffmpeg error. skip!
        cancelDownload(videoId);
      } else {
        console.log(typeof error);
        console.error(error);
        downloadQueue.push(videoId);
        await sleep(1000);
      }
    }
  } else {
    await sleep(1000);
  }
  runQueue();
}
