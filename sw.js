const CACHE = 'hr-essential-v4';
const FILES = [
  '/hr-essential/',
  '/hr-essential/index.html',
  '/hr-essential/hr-calculator.html',
  '/hr-essential/hr-apprendistato.html',
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
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
