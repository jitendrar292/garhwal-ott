// __BUILD_ID__ is replaced at build time by the Vite plugin in vite.config.js.
// In dev (un-built) it stays as the literal string, which is fine — dev SW lifecycle is short.
const BUILD_ID = '__BUILD_ID__';
const CACHE_NAME = `pahaditube-${BUILD_ID}`;
const STATIC_ASSETS = [
  // Note: '/' intentionally NOT precached. Index.html must always come from
  // the network so users get current bundle hashes (see fetch handler).
  '/manifest.json',
  '/logo.png',
  '/icons/icon-192-v2.png',
  '/icons/icon-512-v2.png',
  '/icons/icon-192-maskable-v2.png',
  '/icons/icon-512-maskable-v2.png',
];

// Install — cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Allow the page to force-activate a waiting SW (used after a new build is detected)
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING' || event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate — clean old caches, and purge any pre-existing cached '/'
// so users with the old (cache-first HTML) SW recover on first activation.
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    // Purge stale index.html that the old SW may have cached.
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.delete('/');
      await cache.delete(new Request('/'));
    } catch { /* noop */ }
    await self.clients.claim();
  })());
});

// Fetch — network-first for API & navigation, cache-first for hashed assets.
//
// CRITICAL: HTML must be network-first. Vite emits hashed JS bundle names
// (/assets/index-ABC123.js) that change every build. If we serve a stale
// index.html from cache, it references deleted hashes → 404 → blank screen.
// Network-first for HTML guarantees the user always loads bundle names that
// actually exist on the server.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // API calls: network-first with no cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => new Response(JSON.stringify({ error: 'Offline' }), {
        headers: { 'Content-Type': 'application/json' },
      }))
    );
    return;
  }

  // Navigation / HTML requests: network-first with a hard timeout, cache fallback.
  // mode === 'navigate' covers top-level page loads; the Accept-text/html test
  // catches client-side route fetches in some browsers.
  //
  // CRITICAL on mobile: without a timeout, reopening the PWA on a slow/flaky
  // network can hang forever waiting for the HTML response — user sees a frozen
  // blank screen. We race the network against a 3s timer and fall back to the
  // cached shell so the app can boot, then the in-page SW updater will refresh
  // once connectivity recovers.
  const isNavigation = request.mode === 'navigate'
    || (request.headers.get('accept') || '').includes('text/html');
  if (isNavigation) {
    const NAV_TIMEOUT_MS = 3000;
    const networkFetch = fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/', clone));
        }
        return response;
      });

    event.respondWith((async () => {
      try {
        const response = await Promise.race([
          networkFetch,
          new Promise((_, reject) => setTimeout(() => reject(new Error('nav-timeout')), NAV_TIMEOUT_MS)),
        ]);
        return response;
      } catch {
        const cached = await caches.match('/');
        if (cached) return cached;
        // Last-resort: wait out the original network request (no timeout) so we
        // don't return a fake offline page when the user actually has slow data.
        try { return await networkFetch; } catch { /* fallthrough */ }
        return new Response(
          '<!doctype html><meta charset=utf-8><title>Offline</title><p>Offline — please reconnect.',
          { headers: { 'Content-Type': 'text/html' } }
        );
      }
    })());
    return;
  }

  // Hashed static assets (/assets/*, icons, fonts, etc.): stale-while-revalidate.
  // Safe because their filenames change on every build, so a cache hit always
  // matches the deployed file.
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetched;
    })
  );
});
