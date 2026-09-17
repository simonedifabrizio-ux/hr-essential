const CACHE = 'hr-essential-v7-20260917';
const FILES = [
  '/hr-essential/',
  '/hr-essential/index.html',
  '/hr-essential/hr-calculator.html',
  '/hr-essential/hr-apprendistato.html',
  '/hr-essential/Retribuzioni%20Utility.html',
  '/hr-essential/manifest.json',
  '/hr-essential/icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  const isPage = e.request.mode === 'navigate' ||
    (url.origin === self.location.origin && url.pathname.endsWith('.html'));

  if (isPage) {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, copy));
          return response;
        })
        .catch(() => caches.match(e.request).then(response =>
          response || caches.match('/hr-essential/index.html')
        ))
    );
    return;
  }

  e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)));
});
