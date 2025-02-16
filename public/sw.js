const CACHE_NAME = 'cocobtc-cache-v1';
const OFFLINE_URL = '/offline.html';

const urlsToCache = [
  '/',
  '/manifest.json',
  '/apple-icon.png',
  '/apple-icon-180.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
      }),
      // Create offline page if it doesn't exist
      fetch(OFFLINE_URL).catch(() => {
        return new Response(
          '<html><head><title>Offline - CocoBTC</title></head><body><h1>You are offline</h1><p>Please check your internet connection and try again.</p></body></html>',
          {
            headers: { 'Content-Type': 'text/html' },
          }
        );
      }).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.put(OFFLINE_URL, response);
        });
      })
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response since we need to use it twice
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If the network request fails, try to return the offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('Network error happened', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
    })
  );
}); 