import fs from "node:fs/promises";
import path from "path";
import { getRecords } from "./db";
import io from "./socket";
import { sleep } from "./utils";
import { downloadYoutubeVideo, getPlaylistId, getVideoId } from "./youtube";
import { getVideoIdsFromPlaylist } from "./youtube-api";
import type { TrackData } from "./track";

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
        io.emit("music:download:complete", track);
      } else {
        await downloadYoutubeVideo(downloadsFolder, videoId);
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
