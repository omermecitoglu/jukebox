import "server-only";
import { getRecords } from "./db";

async function getBlacklist(): Promise<string[]> {
  const { blacklist } = await getRecords("blacklist");
  return blacklist ? JSON.parse(blacklist) : [];
}

export async function isBlacklisted(videoId: string) {
  const blacklist = await getBlacklist();
  return blacklist.includes(videoId);
}
