import ytdl from "ytdl-core";
import type { Song } from "~/redux/features/library";
import { downloadMp3FromYoutube } from "./downloader";
import { downloadThumbnail } from "./thumbnail";

export async function downloadTrack(
  videoId: string,
  outputPath: string,
  onProgress: (percentage: number) => void,
): Promise<Song> {
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
