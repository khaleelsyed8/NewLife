const CACHE_NAME = "ledger-v2";

// Local app shell + the pinned third-party libraries the app depends on.
// All three CDN scripts are precached too so CSV/Excel import and charts
// keep working while offline (previously only "basic" same-origin responses
// were cached, so these cross-origin scripts were never available offline).
const APP_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.svg",
  "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
];

self.addEventListener("install", (event) => {
  console.log("[SW] Installing:", CACHE_NAME);

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // cache.addAll() is all-or-nothing: if any single URL fails (e.g. a
      // transient network hiccup, or a missing local asset), the whole
      // install rejects and NOTHING gets cached. Fetching each asset
      // individually means one bad URL can't sink offline support entirely.
      return Promise.all(
        APP_ASSETS.map((url) =>
          fetch(url)
            .then((response) => {
              if (!response.ok && response.type !== "opaque") {
                throw new Error(`Bad response for ${url}: ${response.status}`);
              }
              return cache.put(url, response);
            })
            .catch((err) => {
              console.warn("[SW] Failed to precache (continuing):", url, err);
            })
        )
      );
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
          // "basic" = same-origin responses; "cors" = cross-origin responses
          // served with proper CORS headers (e.g. cdnjs). Both are safe and
          // useful to cache. Opaque (no-cors) responses are deliberately left
          // uncached here since their status can't be verified.
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === "basic" || networkResponse.type === "cors")
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