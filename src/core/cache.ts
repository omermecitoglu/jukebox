import { getHost } from "./host";

export async function isMusicCached(trackId: string) {
  const cache = await caches.open("music");
  const url = new URL(`/${trackId}.mp3`, getHost());
  const response = await cache.match(url);
  return response?.ok === true;
}

export async function deleteMusicCache(trackId: string) {
  const cache = await caches.open("music");
  const url = new URL(`/${trackId}.mp3`, getHost());
  return await cache.delete(url);
}
