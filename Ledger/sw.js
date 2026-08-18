const CACHE_NAME = "ledger-v1";

const APP_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.svg",
];

self.addEventListener("install", (event) => {
  console.log("[SW] Installing:", CACHE_NAME);

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_ASSETS);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activated:", CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseClone = networkResponse.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }

          return networkResponse;
        })
        .catch(() => {
          return caches.match("./index.html");
        });
    })
  );
});