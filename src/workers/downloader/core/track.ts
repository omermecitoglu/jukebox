import fs from "node:fs/promises";
import path from "path";
import { UnrecoverableError } from "bullmq";
import type { Song } from "~/redux/features/library";
import { getRecord, saveRecord } from "./db";
import { downloadTrack } from "./youtube";

async function checkSongExists(videoId: string, downloadsFolder: string) {
  try {
    await fs.access(path.join(downloadsFolder, videoId + ".mp3"));
    return true;
  } catch {
    return false;
  }
}

async function fetchFromDB(videoId: string, downloadsFolder: string, onProgress: (percentage: number) => void) {
  const track = await getRecord<Song>("track:" + videoId);
  if (!track) {
    await fs.unlink(path.join(downloadsFolder, videoId + ".mp3"));
    return fetchFromYoutube(videoId, downloadsFolder, onProgress);
  }
  return track;
}

async function fetchFromYoutube(videoId: string, downloadsFolder: string, onProgress: (percentage: number) => void) {
  const track = await downloadTrack(videoId, downloadsFolder, onProgress);
  await saveRecord("track:" + videoId, track);
  return track;
}

export async function fetchTrack(videoId: string, downloadsFolder: string, onProgress: (percentage: number) => void) {
  try {
    const exists = await checkSongExists(videoId, downloadsFolder);
    if (exists) {
      return fetchFromDB(videoId, downloadsFolder, onProgress);
    } else {
      return fetchFromYoutube(videoId, downloadsFolder, onProgress);
    }
  } catch (error) {
    if (typeof error === "string") {
      if (error.includes("ffmpeg exited with code 1:")) {
        throw new UnrecoverableError(error);
      }
      console.log("Exception string!!!");
      console.log(error);
      throw new Error(error);
    }
    if (error instanceof Error) {
      if (error.message.endsWith("is too long!")) {
        throw new UnrecoverableError(error.message);
      }
      if (error.message.includes("This is a private video.")) {
        throw new UnrecoverableError(error.message);
      }
      if (error.message.includes("Status code: 403")) {
        throw error;
      }
    }
    console.log("Exception!!!");
    console.error(error);
    throw error;
  }
}
