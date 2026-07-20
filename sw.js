// hediye-defteri.html degistiginde bu degeri artir (v2, v3, ...) - aksi halde eski surum cache'te kalir
const CACHE_NAME = 'hediye-defteri-v6';
const APP_SHELL = ['./hediye-defteri.html', './logo.png'];
// Supabase auth/REST istekleri (oturum/senkron) asla cache'ten servis edilmemeli - eski/
// gecersiz bir yanit (ornegin token dogrulama) session_not_found gibi hatalara yol acar.
const SUPABASE_HOST = 'pdxnpnlwrtswwifevlil.supabase.co';

self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){ return cache.addAll(APP_SHELL); })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event){
  if(event.request.method !== 'GET') return;
  if(new URL(event.request.url).hostname === SUPABASE_HOST) return;
  event.respondWith(
    caches.match(event.request).then(function(cached){
      var network = fetch(event.request).then(function(resp){
        if(resp && resp.status === 200){
          var copy = resp.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        }
        return resp;
      }).catch(function(){ return cached; });
      return cached || network;
    })
  );
});
