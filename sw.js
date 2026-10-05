// hediye-defteri.html degistiginde bu degeri artir (v2, v3, ...) - aksi halde eski surum cache'te kalir.
// Numara HTML'deki APP_VERSION ile ayni olmali (Ayarlar'da gorunen surum).
const CACHE_NAME = 'hediye-defteri-v14';
// Canlida (GitHub) sadece index.html var, yerelde hediye-defteri.html - ikisi de denenir, olmayan
// dosya kurulumu bozmasin diye her biri ayri ayri ve hatasi yutularak cache'lenir.
const APP_SHELL = ['./', './index.html', './hediye-defteri.html', './logo.png'];
// HTML'deki <script crossorigin> ile birebir ayni URL olmali - offline acilista supabase-js
// yuklenemezse tum uygulama script'i calismaz.
const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.min.js';
// Supabase auth/REST istekleri (oturum/senkron) asla cache'ten servis edilmemeli - eski/
// gecersiz bir yanit (ornegin token dogrulama) session_not_found gibi hatalara yol acar.
const SUPABASE_HOST = 'pdxnpnlwrtswwifevlil.supabase.co';

self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      // cache:'reload' - tarayicinin HTTP onbellegini (GitHub Pages ~10 dk) atla, yeni surumun
      // cache'ine eski HTML girmesin.
      var reqs = APP_SHELL.map(function(u){ return cache.add(new Request(u, {cache:'reload'})).catch(function(){}); });
      reqs.push(cache.add(new Request(SUPABASE_JS, {mode:'cors'})).catch(function(){}));
      return Promise.all(reqs);
    })
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
  var url = new URL(event.request.url);
  if(url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if(url.hostname === SUPABASE_HOST) return;
  var isNav = event.request.mode === 'navigate';
  event.respondWith(
    caches.match(event.request, {ignoreSearch: isNav}).then(function(cached){
      var network = fetch(event.request).then(function(resp){
        if(resp && resp.status === 200){
          var copy = resp.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        }
        return resp;
      }).catch(function(){
        if(cached) return cached;
        // Offline ve bu URL cache'te yoksa (ornegin OAuth donusu ?code=...), sayfa gezinmesinde
        // uygulama kabugunu ver.
        if(isNav) return caches.match('./index.html').then(function(r){ return r || caches.match('./hediye-defteri.html'); });
        return Response.error();
      });
      return cached || network;
    })
  );
});
