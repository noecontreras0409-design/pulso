// Pulso: guarda la app para usarla sin internet y manda el recordatorio diario
const CACHE="pulso-v3";
const FILES=["./","index.html","manifest.json","icon-192.png","icon-512.png","maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
    const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res;
  }).catch(()=>caches.match("index.html"))));
});
const MSGS=["Tu reto del día te espera.","¿Ya sumaste XP hoy? No rompas tu racha.","Un acertijo, una frase en inglés y una lectura. 10 minutos.","Tacha una tarea y sube de nivel."];
self.addEventListener("periodicsync",e=>{
  if(e.tag==="pulso-daily"){
    e.waitUntil(self.registration.showNotification("Pulso",{body:MSGS[Math.floor(Math.random()*MSGS.length)],icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:"pulso-daily"}));
  }
});
self.addEventListener("notificationclick",e=>{
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:"window"}).then(cs=>cs.length?cs[0].focus():self.clients.openWindow("./")));
});
