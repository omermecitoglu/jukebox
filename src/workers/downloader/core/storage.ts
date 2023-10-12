import fs from "node:fs/promises";
import path from "path";

export function getDownloadsPath() {
  return process.env.DOWNLOADS_PATH || path.join(process.cwd(), "downloads");
}

export async function makeSureDownloadsFolderExists() {
  const targetPath = path.join(getDownloadsPath(), "thumbnails");
  try {
    await fs.access(targetPath);
  } catch {
    console.log("creating downloads folder...");
    await fs.mkdir(targetPath, { recursive: true });
  }
}
