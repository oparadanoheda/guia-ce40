// Retos de Código Escuela 4.0: guarda la página para que funcione sin conexión una vez abierta.
// Primero se pide a la red (así llegan siempre las versiones nuevas); si no hay conexión, se usa lo guardado.
var CACHE = 'ce40-retos-v4';
var ARCHIVOS = ['./', 'index.html', 'tablet.css?v=4', 'tablet.js?v=4', 'retos2.js?v=4', 'manifest.webmanifest', 'icono-192.png', 'icono-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) {
    if (r.ok) { var copia = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copia); }); }
    return r;
  }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match('index.html'); }); }));
});
