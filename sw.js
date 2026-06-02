const CACHE_NAME = "adria-fusion-sailing-v0-8";
const NETWORK_ONLY_HOSTS = new Set([
  "tile.openstreetmap.org",
  "tiles.openseamap.org",
  "server.arcgisonline.com",
  "ows.emodnet-bathymetry.eu",
  "wms.gebco.net",
  "unpkg.com"
]);
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./offline.html",
  "./privacy.html",
  "./about-data.html",
  "./data/split_latest.json",
  "./data/sources.json",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin.includes("open-meteo.com")) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (NETWORK_ONLY_HOSTS.has(url.hostname)) {
    event.respondWith(networkOnly(request));
    return;
  }
  event.respondWith(cacheFirst(request));
});

async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch {
    return caches.match("./offline.html");
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match("./offline.html");
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match("./offline.html");
  }
}
