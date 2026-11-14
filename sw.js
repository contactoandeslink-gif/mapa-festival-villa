// 🎪 Service Worker — Festival Villa
// Estrategia:
//  - App shell (HTML/manifest/iconos PNG & SVG): cache-first, se actualiza en segundo plano.
//  - Teselas del mapa (OpenStreetMap, CartoDB Voyager, MapTiler): cache-first con límite de entradas (funcionan offline tras visitarlas).
//  - Imágenes externas (Unsplash) y fuentes/CDN: stale-while-revalidate (resistentes a red lenta en la cancha).

const CACHE_SHELL = 'festival-shell-v5';
const CACHE_TILES = 'festival-tiles-v4';
const CACHE_MEDIA = 'festival-media-v4';
const MAX_TILES = 500;
const MAX_MEDIA = 100;

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './mapa-festival-4k.jpg',
  './plano-festival-master.svg',
  './mapa-festival-aereo.jpg',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_SHELL)
      .then(cache => cache.addAll(SHELL_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => ![CACHE_SHELL, CACHE_TILES, CACHE_MEDIA].includes(k))
        .map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

async function trimCache(cacheName, maxEntries) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxEntries) {
      await cache.delete(keys[0]);
      return trimCache(cacheName, maxEntries);
    }
  } catch (e) {}
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // 1. Teselas del mapa (OSM, CartoDB, MapTiler): cache-first (crítico para el día del evento en la cancha)
  if (
    url.hostname.includes('tile.openstreetmap.org') ||
    url.hostname.includes('tile.osm.org') ||
    url.hostname.includes('basemaps.cartocdn.com') ||
    url.hostname.includes('maptiler.com')
  ) {
    event.respondWith(
      caches.open(CACHE_TILES).then(async (cache) => {
        const hit = await cache.match(event.request);
        if (hit) return hit;
        try {
          const fresh = await fetch(event.request);
          if (fresh && fresh.status === 200) {
            cache.put(event.request, fresh.clone());
            trimCache(CACHE_TILES, MAX_TILES);
          }
          return fresh;
        } catch (e) {
          return hit || Response.error();
        }
      })
    );
    return;
  }

  // 2. Media externa (Unsplash, fuentes de Google, CDN de Tailwind/Leaflet): stale-while-revalidate
  if (
    url.hostname.includes('unsplash.com') ||
    url.hostname.includes('tailwindcss.com') ||
    url.hostname.includes('unpkg.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('googleapis.com')
  ) {
    event.respondWith(
      caches.open(CACHE_MEDIA).then(async (cache) => {
        const hit = await cache.match(event.request);
        const network = fetch(event.request).then((fresh) => {
          if (fresh && fresh.status === 200) {
            cache.put(event.request, fresh.clone());
            trimCache(CACHE_MEDIA, MAX_MEDIA);
          }
          return fresh;
        }).catch(() => hit);
        return hit || network;
      })
    );
    return;
  }

  // 3. Navegación (app shell): network-first con fallback al cache (siempre abre la app, offline o sin cobertura)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((fresh) => {
          const copy = fresh.clone();
          caches.open(CACHE_SHELL).then(cache => cache.put('./index.html', copy));
          return fresh;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // 4. Resto de recursos same-origin: cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(hit => hit || fetch(event.request))
    );
  }
});
