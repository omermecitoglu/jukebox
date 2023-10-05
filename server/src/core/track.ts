import fs from "node:fs/promises";
import path from "path";
import { getRecords, saveRecord } from "./db";
import io from "./socket";
import { downloadTrack } from "./youtube";
import type { TrackData } from "./youtube/track";

async function checkSongExists(videoId: string, downloadsFolder: string) {
  try {
    await fs.access(path.join(downloadsFolder, videoId + ".mp3"));
    return true;
  } catch {
    return false;
  }
}

async function fetchFromDB(videoId: string, downloadsFolder: string): Promise<TrackData> {
  const records = await getRecords("track:" + videoId);
  const rawData = records["track:" + videoId];
  if (!rawData) {
    await fs.unlink(path.join(downloadsFolder, videoId + ".mp3"));
    return fetchFromYoutube(videoId, downloadsFolder);
  }
  return JSON.parse(rawData);
}

async function fetchFromYoutube(videoId: string, downloadsFolder: string) {
  const track = await downloadTrack(videoId, downloadsFolder, (percentage) => {
    io.to("download:subscriber:" + videoId).emit("music:download:subscription:progress", videoId, percentage);
  });
  await saveRecord("track:" + videoId, JSON.stringify(track));
  return track;
}

export async function fetchTrack(videoId: string, downloadsFolder: string) {
  const exists = await checkSongExists(videoId, downloadsFolder);
  if (exists) {
    return fetchFromDB(videoId, downloadsFolder);
  } else {
    return fetchFromYoutube(videoId, downloadsFolder);
  }
}
