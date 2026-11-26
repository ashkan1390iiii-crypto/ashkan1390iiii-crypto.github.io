const CACHE='moradi-web-v12';
const CORE=[
 '/', '/index.html','/manifest.webmanifest','/icon.svg','/logo.svg','/404.html','/offline.html',
 '/site-builder.html','/ai-assistant.html','/services.html','/portfolio.html','/pricing.html','/compare.html','/order.html','/preview.html','/marketplace-upgrade.css','/marketplace-upgrade.js','/inner-pages.js','/profile-menu.js','/seo.js',
 '/calculator.html','/extras.html','/articles.html','/consultation.html',
 '/tracking.html','/faq.html','/tools.html','/avid.html','/contact.html','/account.html','/auth.html','/tickets.html','/blog.html',
 '/terms.html','/privacy.html','/admin.html','/admin-suite.html','/admin-tools.html'
];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(CORE);await self.skipWaiting()})());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})());
});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith((async()=>{
   try{
    const response=await fetch(req);
    if(response.ok&&CORE.includes(url.pathname)) {
     const cache=await caches.open(CACHE);cache.put(url.pathname,response.clone());
    }
    return response;
   }catch(_){
    const cache=await caches.open(CACHE);
    return (await cache.match(url.pathname))||(await cache.match('/offline.html'))||(await cache.match('/404.html'));
   }
  })());
  return;
 }
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE),cached=await cache.match(url.pathname);
  const network=fetch(req).then(response=>{if(response.ok)cache.put(url.pathname,response.clone());return response}).catch(()=>cached);
  return cached||network;
 })());
});
