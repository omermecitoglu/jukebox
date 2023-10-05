import ytdl from "ytdl-core";
import { downloadMp3FromYoutube } from "./downloader";
import { downloadThumbnail } from "./thumbnail";
import type { TrackData } from "./track";

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

export async function downloadTrack(
  videoId: string,
  outputPath: string,
  onProgress: (percentage: number) => void,
): Promise<TrackData> {
  const info = await ytdl.getInfo(videoId);
  if (parseInt(info.videoDetails.lengthSeconds) > 600) {
    throw new Error(videoId + " is too long!");
  }
  const data = await downloadMp3FromYoutube(videoId, outputPath, onProgress);
  const thumbnail = await downloadThumbnail(videoId, outputPath);
  return {
    id: videoId,
    artist: data.artist,
    title: data.title,
    thumbnail: thumbnail,
  };
}
