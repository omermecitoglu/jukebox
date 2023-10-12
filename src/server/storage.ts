import "server-only";
import fs from "node:fs/promises";
import path from "path";

function getDownloadsPath() {
  return process.env.DOWNLOADS_PATH || path.join(process.cwd(), "downloads");
}

export async function isDownloaded(file: string) {
  try {
    await fs.access(path.join(getDownloadsPath(), file));
    return true;
  } catch {
    return false;
  }
}
