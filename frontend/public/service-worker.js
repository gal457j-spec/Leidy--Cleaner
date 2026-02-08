const CACHE_NAME = 'leidy-cleaner-v1';
const urlsToCache = [
  '/',
  '/styles/globals.css',
  '/images/logo.png',
  '/offline.html'
];

// Instalação - cache dos arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(() => {
        // Alguns arquivos podem não estar disponíveis, continuar mesmo assim
        return cache.addAll(urlsToCache.filter(url => url !== '/offline.html'));
      });
    })
  );
  self.skipWaiting();
});

// Ativação - limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// fetch - estratégia network-first,fall-back-to-cache
self.addEventListener('fetch', event => {
  // Skip CORS requests e requests não-GET
  if (event.request.method !== 'GET') {
    return;
  }

  const isAPI = event.request.url.includes('/api/');
  const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/i.test(event.request.url);

  if (isAPI) {
    // API: network-first, fallback cache
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Copiar response para cache
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(cachedResponse => {
            return cachedResponse || new Response('Offline - Data not available', {
              status: 503,
              statusText: 'Offline'
            });
          });
        })
    );
  } else if (isStaticAsset) {
    // Assets: cache-first, fallback network
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(fetchResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  } else {
    // HTML pages: network-first
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});
