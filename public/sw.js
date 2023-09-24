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
  // console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(appCacheName);
      // console.log("[Service Worker] Caching all: app shell and content");
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
      if (response.status === 200) {
        const isMusic = /\.mp3$/i.test(e.request.url);
        const cache = await caches.open(isMusic ? "music" : appCacheName);
        // console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        const cloneRequest = new Request(e.request, {
          headers: {
            ...e.request.headers,
            Range: "bytes=0-",
          },
        });
        await cache.put(cloneRequest, response.clone());
      }
      return response;
    })(),
  );
});
