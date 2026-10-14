const VIDEO_CACHE_NAME = 'phone2car-video-cache-v1';
const IMAGE_CACHE_NAME = 'phone2car-image-cache-v1';
const pendingVideoCaches = new Map();
let videoCacheWrites = Promise.resolve();

const APP_CACHE_NAME='xp-clock-offline-20261014-car-sensors-4';
const appBase=new URL('./',self.location.href);
const appKey=url=>{const parsed=new URL(url);if(parsed.pathname===appBase.pathname)parsed.pathname+='index.html';parsed.search='';parsed.hash='';return parsed.href;};
function isAppResource(request){
 const url=new URL(request.url);
 if(url.origin!==appBase.origin||!url.pathname.startsWith(appBase.pathname))return false;
 const path=url.pathname.slice(appBase.pathname.length);
 return request.mode==='navigate'&&['','index.html','sensors.html','mobile.html'].includes(path)||
 /^(?:assets\/[^/]+\.(?:js|css)|(?:local-[^/]+|pages-bootstrap|sensor-(?:core|panel))\.(?:js|css)|(?:style-v610|clock-presets|spectrum)\.css|(?:pages-config|library|deployment-version)\.json|branding\/[^/]+\.(?:png|svg)|companions\/xiaop\/(?:plush-heads-fine-v5|plush-parts-v3|plush-food-board|plush-food-board-alt)\.png)$/.test(path);
}
async function prepareAppCache(){
 const response=await fetch(new URL('offline-manifest.json',appBase),{cache:'no-store'});
 if(!response.ok)throw Error('Offline manifest unavailable');
 const manifest=await response.json(),cache=await caches.open(APP_CACHE_NAME);
 const files=manifest.files;
 if(!Array.isArray(files)||manifest.version!=='20261014-clean-offline')throw Error('Offline manifest mismatch');
 for(let i=0;i<files.length;i+=6)await Promise.all(files.slice(i,i+6).map(async file=>{
  const url=new URL(file,appBase);if(url.origin!==appBase.origin||!url.pathname.startsWith(appBase.pathname))throw Error('Invalid offline resource');
  const response=await fetch(url,{cache:'reload'});if(!response.ok)throw Error('Offline resource unavailable');
  await cache.put(appKey(url),response);
 }));
}
self.addEventListener('install',event=>event.waitUntil(prepareAppCache().then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 await self.clients.claim();
 for(const name of await caches.keys())if(name.startsWith('xp-clock-offline-')&&name!==APP_CACHE_NAME)await caches.delete(name);
})()));
async function readAppResource(request){
 const cache=await caches.open(APP_CACHE_NAME),key=appKey(request.url);
 const cached=await cache.match(key);
 if(request.mode!=='navigate'&&cached)return cached;
 try{const response=await fetch(request);if(response.ok)await cache.put(key,response.clone());return response;}catch(error){if(cached)return cached;throw error;}
}

function isCacheableVideoUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.origin !== self.location.origin) return false;
    if (!/\/(?:uploads|private-uploads|showcase-uploads|developer-uploads)\//.test(parsed.pathname)) return false;
    return /\.mp4(?:$|\?)/i.test(`${parsed.pathname}${parsed.search}`);
  } catch {
    return false;
  }
}

function isCacheableImageUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.origin !== self.location.origin) return false;
    if (!/\/(?:uploads|private-uploads|showcase-uploads|developer-uploads)\//.test(parsed.pathname)) return false;
    return /\.(?:avif|bmp|gif|jpe?g|png|svg|webp)(?:$|\?)/i.test(`${parsed.pathname}${parsed.search}`);
  } catch {
    return false;
  }
}

async function cachedVideoEntries(cache) {
  const requests = await cache.keys();
  const entries = [];
  for (const request of requests) {
    const response = await cache.match(request);
    if (!response) continue;
    entries.push({
      request,
      size: Math.max(0, Number(response.headers.get('x-video-cache-size') || response.headers.get('content-length')) || 0),
      cachedAt: Math.max(0, Number(response.headers.get('x-video-cached-at')) || 0),
    });
  }
  return entries;
}

async function makeVideoCacheRoom(cache, incomingBytes, limitBytes) {
  const entries = await cachedVideoEntries(cache);
  let total = entries.reduce((sum, entry) => sum + entry.size, 0);
  entries.sort((left, right) => left.cachedAt - right.cachedAt);
  for (const entry of entries) {
    if (total + incomingBytes <= limitBytes) break;
    if (await cache.delete(entry.request)) total -= entry.size;
  }
  return total + incomingBytes <= limitBytes;
}

async function cacheVideo(url, configuredLimitBytes) {
  if (pendingVideoCaches.has(url)) return pendingVideoCaches.get(url);
  const task = videoCacheWrites.then(() => storeVideo(url, configuredLimitBytes));
  pendingVideoCaches.set(url, task);
  videoCacheWrites = task.catch(() => false);
  try { return await task; }
  finally { pendingVideoCaches.delete(url); }
}

async function storeVideo(url, configuredLimitBytes) {
  if (!isCacheableVideoUrl(url)) return false;
  const cache = await caches.open(VIDEO_CACHE_NAME);
  const cached = await cache.match(url);
  if (cached) return true;
  const controller = new AbortController();
  const deadline = setTimeout(() => controller.abort(), 120000);
  try {
    const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', signal: controller.signal });
    if (!response.ok || response.status !== 200) return false;
    const limitBytes = Math.max(0, Number(configuredLimitBytes) || 100 * 1024 * 1024);
    const size = Math.max(0, Number(response.headers.get('content-length')) || 0);
    if (!size || size > limitBytes || !(await makeVideoCacheRoom(cache, size, limitBytes))) return false;
    const headers = new Headers(response.headers);
    headers.set('x-video-cache-size', String(size));
    headers.set('x-video-cached-at', String(Date.now()));
    await cache.put(url, new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    }));
    return true;
  } finally { clearTimeout(deadline); }
}

async function videoIsCached(url) {
  if (!isCacheableVideoUrl(url)) return false;
  const cache = await caches.open(VIDEO_CACHE_NAME);
  return Boolean(await cache.match(url));
}

async function cachedImageEntries(cache) {
  const requests = await cache.keys();
  const entries = [];
  for (const request of requests) {
    const response = await cache.match(request);
    if (!response) continue;
    entries.push({
      request,
      size: Math.max(0, Number(response.headers.get('x-image-cache-size') || response.headers.get('content-length')) || 0),
      cachedAt: Math.max(0, Number(response.headers.get('x-image-cached-at')) || 0),
    });
  }
  return entries;
}

async function makeImageCacheRoom(cache, incomingBytes, limitBytes) {
  const entries = await cachedImageEntries(cache);
  let total = entries.reduce((sum, entry) => sum + entry.size, 0);
  entries.sort((left, right) => left.cachedAt - right.cachedAt);
  for (const entry of entries) {
    if (total + incomingBytes <= limitBytes) break;
    if (await cache.delete(entry.request)) total -= entry.size;
  }
  return total + incomingBytes <= limitBytes;
}

async function cacheImage(url, configuredLimitBytes, expectedSize = 0) {
  if (!isCacheableImageUrl(url)) return { cached: false, reason: 'invalid-image-url' };
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cached = await cache.match(url);
  if (cached) return { cached: true, reason: 'already-cached' };
  let response;
  try {
    response = await fetch(url, { credentials: 'same-origin', cache: 'force-cache' });
  } catch {
    return { cached: false, reason: 'image-fetch-failed' };
  }
  if (!response.ok || response.status !== 200) return { cached: false, reason: `image-http-${response.status || 0}` };
  if (!/^image\//i.test(response.headers.get('content-type') || '')) return { cached: false, reason: 'invalid-image-content-type' };
  const limitBytes = Math.max(0, Number(configuredLimitBytes) || 100 * 1024 * 1024);
  let size = Math.max(0, Number(response.headers.get('content-length')) || Number(expectedSize) || 0);
  if (!size) {
    try { size = (await response.clone().blob()).size; }
    catch { return { cached: false, reason: 'image-size-unavailable' }; }
  }
  if (!size) return { cached: false, reason: 'image-size-unavailable' };
  if (size > limitBytes) return { cached: false, reason: 'image-over-cache-limit' };
  if (!(await makeImageCacheRoom(cache, size, limitBytes))) return { cached: false, reason: 'image-cache-capacity-insufficient' };
  const headers = new Headers(response.headers);
  headers.set('x-image-cache-size', String(size));
  headers.set('x-image-cached-at', String(Date.now()));
  try {
    await cache.put(url, new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    }));
    return { cached: true, reason: 'cached' };
  } catch {
    return { cached: false, reason: 'image-cache-write-failed' };
  }
}

function parseRange(rangeHeader, size) {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(rangeHeader || '');
  if (!match || (!match[1] && !match[2]) || !Number.isSafeInteger(size) || size <= 0) return null;
  let start = match[1] ? Number(match[1]) : 0;
  let end = match[2] ? Number(match[2]) : size - 1;
  if (!match[1] && match[2]) {
    const suffix = Number(match[2]);
    start = Math.max(0, size - suffix);
    end = size - 1;
  }
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start < 0 || start >= size) return null;
  end = Math.min(end, size - 1);
  return { start, end };
}

async function partialResponse(response, rangeHeader) {
  const size = Number(response.headers.get('content-length'));
  const range = Number.isFinite(size) && size > 0 ? parseRange(rangeHeader, size) : null;
  if (!range) {
    return new Response(null, {
      status: 416,
      headers: { 'Content-Range': `bytes */${Number.isFinite(size) ? size : '*'}` },
    });
  }
  const reader = response.body?.getReader();
  if (!reader) return new Response(null, { status: 500 });
  let sourceOffset = 0;
  const body = new ReadableStream({
    async pull(controller) {
      while (sourceOffset <= range.end) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        const chunk = value instanceof Uint8Array ? value : new Uint8Array(value);
        const chunkStart = sourceOffset;
        const chunkEnd = sourceOffset + chunk.byteLength - 1;
        sourceOffset += chunk.byteLength;
        if (chunkEnd < range.start) continue;
        const sliceStart = Math.max(0, range.start - chunkStart);
        const sliceEnd = Math.min(chunk.byteLength, range.end - chunkStart + 1);
        if (sliceEnd > sliceStart) controller.enqueue(chunk.subarray(sliceStart, sliceEnd));
        if (chunkEnd >= range.end) {
          // A cloned/tee'd cache body may wait for its other branch on cancel.
          // Finish the requested range immediately; cancellation runs separately.
          reader.cancel().catch(() => {});
          controller.close();
        }
        return;
      }
      reader.cancel().catch(() => {});
      controller.close();
    },
    cancel() { return reader.cancel().catch(() => {}); },
  });
  const headers = new Headers(response.headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Content-Length', String(range.end - range.start + 1));
  headers.set('Content-Range', `bytes ${range.start}-${range.end}/${size}`);
  return new Response(body, { status: 206, statusText: 'Partial Content', headers });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if(isAppResource(request)){event.respondWith(readAppResource(request));return;}
  if (isCacheableImageUrl(request.url)) {
    event.respondWith(readCachedMedia(request, IMAGE_CACHE_NAME).then(cached => cached || fetch(request)));
    return;
  }
  if (!isCacheableVideoUrl(request.url)) return;

  event.respondWith(readCachedMedia(request, VIDEO_CACHE_NAME).then(cached => cached || fetch(request)));
});

async function readCachedMedia(request, cacheName) {
  let timer;
  try {
    return await Promise.race([
      (async () => {
        const cache = await caches.open(cacheName);
        const cached = await cache.match(request.url);
        if (!cached) return null;
        const range = request.headers.get('range');
        return cacheName === VIDEO_CACHE_NAME && range ? partialResponse(cached, range) : cached;
      })(),
      new Promise(resolve => { timer = setTimeout(() => resolve(null), 1500); }),
    ]);
  } catch { return null; }
  finally { clearTimeout(timer); }
}

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'CACHE_IMAGE' && data.url) {
    event.waitUntil((async () => {
      let result;
      try { result = await cacheImage(data.url, data.limitBytes, data.size); }
      catch { result = { cached: false, reason: 'image-cache-unexpected-failure' }; }
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      clients.forEach((client) => client.postMessage({
        type: 'IMAGE_CACHE_UPDATED',
        url: data.url,
        cached: result.cached,
        reason: result.reason,
      }));
    })());
  }
  if (data.type === 'CLEAR_IMAGE_CACHE' && data.url) {
    event.waitUntil((async () => {
      const cache = await caches.open(IMAGE_CACHE_NAME);
      const cleared = await cache.delete(data.url);
      event.source?.postMessage?.({ type: 'IMAGE_CACHE_CLEARED', requestId: data.requestId || '', url: data.url, cleared });
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      clients.forEach((client) => client.postMessage({ type: 'IMAGE_CACHE_UPDATED', url: data.url, cached: false }));
    })());
  }
  if (data.type === 'CACHE_VIDEO' && data.url) {
    event.waitUntil((async () => {
      let cached = false;
      try { cached = await cacheVideo(data.url, data.limitBytes); } catch {}
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      clients.forEach((client) => client.postMessage({ type: 'VIDEO_CACHE_UPDATED', url: data.url, cached }));
    })());
  }
  if (data.type === 'CHECK_VIDEO_CACHE' && data.url) {
    event.waitUntil((async () => {
      const cached = await videoIsCached(data.url);
      event.source?.postMessage?.({
        type: 'VIDEO_CACHE_STATUS',
        requestId: data.requestId || '',
        url: data.url,
        cached,
      });
    })());
  }
  if (data.type === 'CLEAR_VIDEO_CACHE' && data.url) {
    event.waitUntil((async () => {
      const cache = await caches.open(VIDEO_CACHE_NAME);
      const cleared = await cache.delete(data.url);
      event.source?.postMessage?.({ type: 'VIDEO_CACHE_CLEARED', requestId: data.requestId || '', url: data.url, cleared });
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      clients.forEach((client) => client.postMessage({ type: 'VIDEO_CACHE_UPDATED', url: data.url, cached: false }));
    })());
  }
});
