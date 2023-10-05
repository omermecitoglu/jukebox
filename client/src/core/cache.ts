import { getHost } from "./host";

type CacheRunnerParams = {
  trackIds: string[],
  cache: string[],
  signal: AbortSignal,
  markProspect: (trackId: string | null) => void,
  resolve: (trackId: string) => void,
};

export async function cacheNextMusic({
  trackIds,
  cache,
  signal,
  markProspect,
  resolve,
}: CacheRunnerParams) {
  const uncachedTrackId = trackIds.find(t => !cache.includes(t));
  if (uncachedTrackId) {
    markProspect(uncachedTrackId);
    await cacheThumbnail(uncachedTrackId, signal);
    const success = await cacheMusic(uncachedTrackId, signal);
    if (success) resolve(uncachedTrackId);
    markProspect(null);
  }
}

async function cacheMusic(trackId: string, signal: AbortSignal) {
  try {
    const url = new URL(`/${trackId}.mp3`, getHost());
    const response = await fetch(url, { signal });
    return response.status === 200;
  } catch {
    return false;
  }
}

async function cacheThumbnail(trackId: string, signal: AbortSignal) {
  try {
    const url = new URL(`/thumbnails/${trackId}.jpg`, getHost());
    const response = await fetch(url, { signal });
    return response.status === 200;
  } catch {
    return false;
  }
}

/* export async function isMusicCached(trackId: string) {
  const cache = await caches.open("music");
  const url = new URL(`/${trackId}.mp3`, getHost());
  const response = await cache.match(url);
  return response?.ok === true;
} */

export async function deleteMusicCache(trackId: string) {
  const cache = await caches.open("music");
  const url = new URL(`/${trackId}.mp3`, getHost());
  return await cache.delete(url);
}

export async function getCachedMusicList(): Promise<string[]> {
  const cache = await caches.open("music");
  const keys = await cache.keys();
  return keys.map(req => getVideoId(req.url)).filter(id => id.length);
}

function getVideoId(url: string) {
  const match = url.match(/\/([^/]+).mp3$/);
  return match ? match[1] : "";
}
