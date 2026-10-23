// The image/video viewers also work when the browser refuses native fullscreen.
// A fullscreen browser containing the gallery is still the gallery.
const surfaceSelector = '#imageViewer, #videoViewer, .plush-clock-viewer';

export function displayState(doc = document) {
  const native = doc.fullscreenElement || doc.webkitFullscreenElement;
  const clock = doc.querySelector('.plush-clock-viewer');
  const clockPresenting = clock && (clock.classList.contains('focus') ||
    clock.getAttribute('aria-label') === '毛绒时钟屏保模式' ||
    native && (native === clock || native.contains(clock)));
  const surface = clockPresenting ? clock : doc.querySelector('#imageViewer.open, #videoViewer.open');
  const nativeMedia = native?.matches?.('#wallpaperScreen') ? native : null;
  const active = !!(surface || nativeMedia);
  const host = active ? native && native !== doc.documentElement && native !== doc.body ? native : surface || nativeMedia : doc.body;
  return { active, host, kind: !active ? 'gallery' : host === clock || surface === clock ? 'clock' : surface?.id === 'videoViewer' ? 'video' : 'wallpaper' };
}

export function observeDisplayState(update) {
  let previous, queued = false;
  const sync = () => {
    queued = false;
    const state = displayState();
    if (previous?.active === state.active && previous?.host === state.host && previous?.kind === state.kind) return;
    previous = state;
    update(state);
  };
  const schedule = () => { if (!queued) { queued = true; queueMicrotask(sync); } };
  const related = node => node.nodeType === 1 && (node.matches(surfaceSelector) || node.querySelector(surfaceSelector));
  const observer = new MutationObserver(records => {
    if (records.some(record => record.type === 'attributes' ? record.target.matches(surfaceSelector) :
      [...record.addedNodes, ...record.removedNodes].some(related))) schedule();
  });
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'aria-label'] });
  for (const event of ['fullscreenchange', 'webkitfullscreenchange']) document.addEventListener(event, schedule);
  sync();
  return () => { observer.disconnect(); for (const event of ['fullscreenchange', 'webkitfullscreenchange']) document.removeEventListener(event, schedule); };
}
