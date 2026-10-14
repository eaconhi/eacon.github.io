// Install the same worker used by wallpaper caching before opening the clock.
(() => {
  if(!('serviceWorker' in navigator)||!window.isSecureContext)return;
  const base=new URL('.',document.currentScript.src);
  window.__XP_OFFLINE_READY=navigator.serviceWorker.register(new URL('video-cache-sw-v610.js',base),{scope:base.pathname,updateViaCache:'none'}).then(async registration=>{
    await registration.update();
    await navigator.serviceWorker.ready;
    return true;
  }).catch(()=>false);
})();
