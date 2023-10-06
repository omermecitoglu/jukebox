// eslint-disable-next-line spaced-comment
/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;
declare const clients: Clients;
declare global {
  const BUILD_ID: string;
  const STATIC_FILES: string[];
}
export {};

const appCacheName = BUILD_ID;

const protectedCache = [
  appCacheName,
  "music",
  "thumbnails",
  "others",
];

const appShellFiles = STATIC_FILES;

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(appCacheName);
      await cache.addAll(appShellFiles);
    })(),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      const outdated = keyList.filter(key => !protectedCache.includes(key));
      return Promise.all(outdated.map(key => caches.delete(key)));
    }).then(() => {
      return clients.claim();
    }),
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(handleRequests(e.request));
});

async function handleRequests(request: Request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  const response = await fetch(request);
  const isCacheable = isResourceCacheable(request, response);
  if (isCacheable) {
    const cacheStorage = getCacheStorage(request.url);
    const cache = await caches.open(cacheStorage);
    await cache.put(fixHeaders(cacheStorage, request), response.clone());
  }
  return response;
}

function isResourceCacheable(request: Request, response: Response) {
  if (request.method !== "GET") return false;
  if (/\/socket.io\//i.test(request.url)) return false;
  if (response.status !== 200) return false;
  return true;
}

function getCacheStorage(url: string) {
  if (/\/thumbnails\/(.*?)(\.jpg)$$/.test(url)) {
    return "thumbnails";
  }
  if (/\.mp3$/i.test(url)) {
    return "music";
  }
  if (appShellFiles.includes(new URL(url).pathname)) {
    return appCacheName;
  }
  return "others";
}

function fixHeaders(storage: string, request: Request) {
  if (storage === "music") {
    return new Request(request, {
      headers: {
        ...request.headers,
        Range: "bytes=0-",
      },
    });
  }
  return request;
}
