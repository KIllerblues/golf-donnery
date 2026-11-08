const APP='golf-app-v2';
const TILES='tiles-v1';
const SHELL=['./','index.html','manifest.webmanifest','leaflet.js','leaflet.css','icon-192.png','icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(APP).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==APP&&k!==TILES).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);

  // Tuiles satellite : cache d'abord, sinon réseau puis mise en cache
  if(url.hostname==='server.arcgisonline.com'){
    e.respondWith(
      caches.open(TILES).then(async c=>{
        const hit=await c.match(req.url);
        if(hit)return hit;
        try{
          const res=await fetch(req);
          if(res&&(res.ok||res.type==='opaque'))c.put(req.url,res.clone());
          return res;
        }catch(err){
          return new Response('',{status:504});
        }
      })
    );
    return;
  }

  // Fichiers de l'appli : cache d'abord, rafraîchi en arrière-plan
  if(url.origin===location.origin){
    e.respondWith(
      caches.open(APP).then(async c=>{
        const hit=await c.match(req,{ignoreSearch:true});
        const net=fetch(req).then(res=>{if(res&&res.ok)c.put(req,res.clone());return res;}).catch(()=>null);
        return hit||(await net)||new Response('Hors-ligne',{status:503});
      })
    );
  }
});
