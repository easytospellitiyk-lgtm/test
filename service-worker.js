const CACHE_NAME = 'pwa-landing-cache-v1';
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/thank-you.html',
  '/styles.css',
  '/script.js',
  '/manifest.webmanifest',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Только GET-запросы
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          // Кэшируем новые ресурсы по мере загрузки
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          return networkResponse;
        })
        .catch(() => {
          // Простейший fallback: если запрос страницы, вернуть index.html
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
