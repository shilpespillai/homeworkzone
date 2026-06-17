const CACHE_NAME = 'homeworkzone-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/logo.png',
  '/mascot.png',
  '/ic-classes.png',
  '/ic-homework.png',
  '/ic-messages.png',
  '/ic-reports.png',
  '/ic-rewards.png',
  '/ic-students.png'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Exclude Firebase Firestore, Auth, and other API endpoints from cache
  if (
    requestUrl.origin !== self.location.origin || 
    event.request.method !== 'GET' ||
    event.request.url.includes('firestore.googleapis.com') ||
    event.request.url.includes('identitytoolkit.googleapis.com') ||
    event.request.url.includes('generativelanguage.googleapis.com')
  ) {
    return;
  }

  // Network-First for HTML/navigation requests to prevent cached index.html referencing deleted hashes
  if (event.request.mode === 'navigate' || requestUrl.pathname === '/' || requestUrl.pathname === '/index.html') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // If the network response is successful (status 200), return and cache it
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          }
          // If the server returns a 404 or other non-200 status (e.g. client-side route not handled by server),
          // fall back to the cached App Shell (index.html)
          return caches.match('/index.html').then((cachedIndex) => {
            if (cachedIndex) {
              return cachedIndex;
            }
            return caches.match('/').then((cachedRoot) => {
              return cachedRoot || networkResponse;
            });
          });
        })
        .catch(() => {
          // If network fetch fails completely (e.g. offline), fall back to cached App Shell
          return caches.match('/index.html').then((cachedIndex) => {
            if (cachedIndex) {
              return cachedIndex;
            }
            return caches.match('/').then((cachedRoot) => {
              if (cachedRoot) {
                return cachedRoot;
              }
              // If nothing is in cache, return a basic offline error response
              return new Response(
                '<h1>Offline</h1><p>You are offline and the app shell could not be loaded from cache. Please reconnect to the internet.</p>',
                {
                  status: 503,
                  headers: { 'Content-Type': 'text/html' }
                }
              );
            });
          });
        })
    );
    return;
  }

  // Cache-First for other static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          // Cache new static assets
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch((error) => {
          console.warn('[Service Worker] Fetch failed for static asset:', event.request.url, error);
          // Return a basic 404 or network error response so the promise doesn't reject uncaught
          return new Response('Asset not found', { status: 404, statusText: 'Not Found' });
        });
    })
  );
});
