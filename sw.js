// অফলাইনে অ্যাপ চালানোর জন্য: নেট থাকলে নতুন সংস্করণ নেয়, না থাকলে জমানো সংস্করণ দেখায়।
const V = 'pathporikolpona-v6';
const ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'logo.png', 'icon-192.png', 'icon-512.png',
  'libs/supabase.js', 'libs/jszip.min.js', 'libs/pptxgen.bundle.js'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;   // ডেটাবেসের অনুরোধ জমানো হয় না
  e.respondWith(
    fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match('index.html')))
  );
});
