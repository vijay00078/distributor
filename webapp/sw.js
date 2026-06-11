// Sauda Distributor PWA Service Worker
const CACHE_NAME = 'sauda-distributor-v1';

// App shell files to pre-cache
const APP_SHELL = [
  './',
  './index.html',
  './css/style.css',
  './pwa-manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Install event — cache the app shell
self.addEventListener('install', function(event) {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] Caching app shell');
      return cache.addAll(APP_SHELL);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event — clean up old caches
self.addEventListener('activate', function(event) {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          console.log('[SW] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event — network-first strategy with cache fallback
self.addEventListener('fetch', function(event) {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests to CDNs (let them go through network directly)
  if (event.request.url.includes('ui5.sap.com') || event.request.url.includes('cdn.tailwindcss.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Clone the response before caching
        var responseClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(function() {
        // If network fails, try cache
        return caches.match(event.request).then(function(response) {
          return response || new Response('Offline — please check your connection.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        });
      })
  );
});
