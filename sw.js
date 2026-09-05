// ════════════════════════════════════════
// SERVICE WORKER — Custom Product Builder
// Enables offline support + caching
// ════════════════════════════════════════

const CACHE_NAME    = 'cpb-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/catalog.html',
  '/checkout.html',
  '/order-history.html',
  '/login.html',
  '/scripts/builder.js',
  '/scripts/cart.js',
  '/scripts/products.js',
  '/scripts/utils.js',
  '/scripts/api.js',
  '/scripts/reviews.js',
  '/scripts/theme.js',
  '/scripts/admin-nav.js',
  '/styles/theme.css',
  '/styles/general.css',
  '/styles/product-builder.css',
  '/styles/cart.css',
  '/images/products/backpack.jpg',
  '/images/products/sneaker.jpg',
  '/images/products/tshirt.jpg',
  '/images/products/hoodie.jpg',
  '/images/products/jacket.jpg',
  '/images/products/boots.jpg',
  '/images/products/sandals.jpg',
  '/images/products/cap.jpg',
  '/images/products/watch.jpg',
  '/images/products/belt.jpg',
  '/images/products/tote.jpg',
  '/images/products/dufflebag.jpg'
];

// ── Install: cache all static assets ──
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).catch(err => {
      console.error('[SW] Cache install error:', err);
    })
  );
  self.skipWaiting();
});

// ── Activate: clean old caches ──
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: serve from cache, fallback to network ──
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API requests — always fetch from network
  if (url.hostname.includes('railway.app')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(
          JSON.stringify({ message: 'You are offline. Please check your connection.' }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      )
    );
    return;
  }

  // Skip external CDN requests (fonts, Chart.js etc) — network first
  if (!url.hostname.includes('localhost') &&
      !url.hostname.includes('127.0.0.1') &&
      !url.hostname.includes('netlify.app') &&
      !url.hostname.includes('netlify.com')) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // Cache first strategy for static assets
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        // Return cached version and update cache in background
        fetch(request).then(response => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
          }
        }).catch(() => {});
        return cached;
      }

      // Not in cache — fetch from network
      return fetch(request).then(response => {
        if (!response || response.status !== 200) return response;

        // Cache the new response
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        return response;
      }).catch(() => {
        // Offline fallback for HTML pages
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ── Push notifications (future use) ──
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  const title   = data.title   || 'Custom Product Builder';
  const options = {
    body:    data.body    || 'You have a new notification',
    icon:    '/images/icons/icon-192.png',
    badge:   '/images/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data:    { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// ── Notification click ──
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});