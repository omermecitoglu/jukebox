import "server-only";
import fs from "node:fs/promises";
import path from "path";

const downloadsFolder = path.join(process.cwd(), "downloads");

export async function isDownloaded(file: string) {
  try {
    await fs.access(path.join(downloadsFolder, file));
    return true;
  } catch {
    return false;
  }
}
