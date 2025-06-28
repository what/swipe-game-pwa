const CACHE_NAME = 'swipe-game-v1';
const urlsToCache = [
  './swipe-game.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
  'https://cdn.tailwindcss.com'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache installation failed:', error);
        // Don't fail installation if Tailwind CDN fails
        return caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.addAll([
              './swipe-game.html',
              './manifest.json',
              './icon-192.svg',
              './icon-512.svg'
            ]);
          });
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, return the main page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./swipe-game.html');
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});