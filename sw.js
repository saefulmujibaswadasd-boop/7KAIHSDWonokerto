const CACHE_NAME = "7kaih-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./admin.html",
  "./dashboard-guru.html",
  "./raport.html",
  "./manifest.json",
  "./assets/css/style.css",
  "./assets/js/app.js",
  "./assets/js/api.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});