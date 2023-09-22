const appCacheName = "v2";

const protectedCache = [
  appCacheName,
  "music",
];

const appShellFiles = [
  "/favicon.ico",
  "/", // index.html
  "/index.js",
  "/style.css",
];

self.addEventListener("install", (e) => {
  // console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(appCacheName);
      // console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(appShellFiles);
    })(),
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      // console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      if (e.request.method !== "GET" || /\/socket.io\//i.test(e.request.url)) {
        return response;
      }
      if (response.status !== 206) {
        const isMusic = /\.mp3$/i.test(e.request.url);
        const cache = await caches.open(isMusic ? "music" : appCacheName);
        // console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
      }
      return response;
    })(),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (protectedCache.includes(key)) {
            return;
          }
          return caches.delete(key);
        }),
      );
    }),
  );
});
