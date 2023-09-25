const appCacheName = "v2";

const protectedCache = [
  appCacheName,
  "music",
];

const appShellFiles = [
  "manifest.json",
  "android-icon-36x36.png",
  "android-icon-48x48.png",
  "android-icon-72x72.png",
  "android-icon-96x96.png",
  "android-icon-144x144.png",
  "android-icon-192x192.png",
  "apple-icon-57x57.png",
  "apple-icon-60x60.png",
  "apple-icon-72x72.png",
  "apple-icon-76x76.png",
  "apple-icon-114x114.png",
  "apple-icon-120x120.png",
  "apple-icon-144x144.png",
  "apple-icon-152x152.png",
  "apple-icon-180x180.png",
  "apple-icon-precomposed.png",
  "apple-icon.png",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "favicon-96x96.png",
  "/favicon.ico",
  "/", // index.html
  "/index.js",
  "/style.css",
];

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

async function handleRequests(request) {
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

function isResourceCacheable(request, response) {
  if (request.method !== "GET") return false;
  if (/\/socket.io\//i.test(request.url)) return false;
  if (response.status !== 200) return false;
  return true;
}

function getCacheStorage(url) {
  if (/\/thumbnails\/(.*?)(\.jpg)$$/.test(url)) {
    return "thumbnails";
  }
  if (/\.mp3$/i.test(url)) {
    return "music";
  }
  return appCacheName;
}

function fixHeaders(storage, request) {
  if (storage === "music") {
    return new Request(request, {
      headers: {
        ...request.headers,
        Range: "bytes=0-",
      },
    })
  }
  return request;
}
