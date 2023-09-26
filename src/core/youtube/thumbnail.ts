import fs from "node:fs/promises";
import path from "path";
import fetch from "node-fetch";

export async function downloadThumbnail(videoId: string, downloadsFolder: string) {
  const response = await fetch(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  const thumbnailPath = path.join(downloadsFolder, "thumbnails", videoId + ".jpg");
  await fs.writeFile(thumbnailPath, Buffer.from(buffer));
  return `/thumbnails/${videoId}.jpg`;
}
