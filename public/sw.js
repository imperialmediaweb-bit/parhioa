/*
 * Service worker for Parohia Sf. Teodora.
 * Deliberately conservative: it exists mainly so the site is installable as an
 * app. It uses network-first for everything and only falls back to a cached
 * copy when the network is unavailable. It NEVER caches admin or API requests.
 */
const CACHE = 'parohia-v1';
const OFFLINE_URLS = ['/', '/manifest.webmanifest', '/icons/icon-192.png'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(OFFLINE_URLS).catch(() => {})),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

// Push notifications (parish announcements).
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Parohia Sf. Teodora', body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'Parohia Sf. Teodora';
  const options = {
    body: data.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url: data.url || '/' },
    vibrate: [100, 50, 100],
    tag: 'parohie-anunt',
    renotify: true,
  };
  // Show the notification AND put a badge (dot/number) on the app icon.
  const jobs = [self.registration.showNotification(title, options)];
  if (self.navigator && self.navigator.setAppBadge) {
    jobs.push(self.navigator.setAppBadge().catch(() => {}));
  }
  event.waitUntil(Promise.all(jobs));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (self.navigator && self.navigator.clearAppBadge) {
    self.navigator.clearAppBadge().catch(() => {});
  }
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) {
          c.navigate(url).catch(() => {});
          return c.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    }),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Same-origin only; never touch admin or API (fresh + private).
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return;

  // Network-first, cache as backup.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) => hit || caches.match('/')),
      ),
  );
});
