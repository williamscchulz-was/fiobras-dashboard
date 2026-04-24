/**
 * Fiobras HUB — Service Worker (v3.22.0)
 *
 * Estratégias por tipo de recurso:
 *   • cache-first              → fontes (gstatic), Chart.js (jsdelivr) — quase nunca mudam
 *   • stale-while-revalidate   → CSS/JS local (hub.css, sub-apps) — serve rápido + atualiza em bg
 *   • network-first            → HTML (index, sub-apps) — pega versão nova quando online
 *   • pass-through             → Firebase RTDB/Auth — real-time, NÃO cacheia
 *
 * Versionamento: cache name = `fiobras-hub-vX.Y.Z`. Bump a cada release.
 * Cliente detecta nova versão via 'controllerchange' e mostra toast "Atualizar".
 */

const VERSION = '4.9.6';
const CACHE_NAME = `fiobras-hub-v${VERSION}`;

const PRECACHE = [
  '/',
  '/index.html',
  '/css/hub.css',
  '/css/tokens.css',  // v3.27.0
  '/manutencao/firebase-messaging-sw.js',  // v3.31.0 — FCM offline-first
];

// ─── Install: pré-cacheia essenciais + skipWaiting ────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE).catch(() => {/* ignora 404 individual */}))
  );
});

// ─── Activate: limpa caches antigos + claim ──────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k.startsWith('fiobras-hub-v') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ─── Fetch: roteia por tipo de recurso ────────────────────────────────────
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Só GET
  if (req.method !== 'GET') return;

  // Pass-through: Firebase real-time (NUNCA cachear)
  if (url.host.includes('firebaseio.com') ||
      url.host.includes('firebaseapp.com') ||
      url.host.includes('identitytoolkit') ||
      url.host.includes('securetoken') ||
      (url.host.includes('googleapis.com') && !url.host.includes('fonts'))) {
    return; // browser default fetch
  }

  // cache-first: fontes Google + CDNs estáticos
  if (url.host.includes('fonts.gstatic.com') ||
      url.host.includes('fonts.googleapis.com') ||
      url.host.includes('cdn.jsdelivr.net') ||
      url.host.includes('cdnjs.cloudflare.com')) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Mesmo origem (HUB + assets locais)
  if (url.origin === self.location.origin) {
    // network-first: HTML (pra pegar version updates)
    if (req.destination === 'document' ||
        url.pathname === '/' ||
        url.pathname.endsWith('.html')) {
      event.respondWith(networkFirst(req));
      return;
    }
    // stale-while-revalidate: CSS, JS, imagens locais
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // Default: pass-through
});

// ─── Strategies ───────────────────────────────────────────────────────────

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, res.clone());
    }
    return res;
  } catch (e) {
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, res.clone());
    }
    return res;
  } catch (e) {
    const cached = await caches.match(req);
    if (cached) return cached;
    // último recurso: index do cache (pra HTML)
    if (req.destination === 'document') {
      const idx = await caches.match('/index.html') || await caches.match('/');
      if (idx) return idx;
    }
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(req) {
  const cached = await caches.match(req);
  const fetchPromise = fetch(req).then(res => {
    if (res && res.status === 200) {
      // v3.52.1 — clone IMEDIATO. Antes o clone era dentro do .then(cache=>...),
      // que rodava async depois do return; aí o body já tinha sido consumido.
      const cloneForCache = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, cloneForCache));
    }
    return res;
  }).catch(() => cached);
  return cached || fetchPromise;
}

// ─── Mensagens do client ──────────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
