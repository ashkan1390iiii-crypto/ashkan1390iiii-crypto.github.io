const CACHE='moradi-web-v2';
const CORE=['/','/index.html','/manifest.webmanifest','/icon.svg','/logo.svg','/404.html','/services.html','/portfolio.html','/pricing.html','/order.html','/preview.html','/calculator.html','/extras.html','/articles.html','/consultation.html','/tracking.html','/faq.html'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim()});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==location.origin||url.pathname.endsWith('.html')&&url.pathname!=='/index.html')return;
 event.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}return res}).catch(()=>caches.match(req).then(hit=>hit||caches.match('/index.html'))));
});