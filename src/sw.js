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
  if (appShellFiles.includes(new URL(url).pathname)) {
    return appCacheName;
  }
  return "others";
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
