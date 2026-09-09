import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the component's actual lifecycle with deterministic browser events.
// No DOM package, network, decoder or timing sleeps are needed for these tests.
const source = readFileSync(new URL('../components/scroll-cinema.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function events(target) {
  const listeners = new Map();
  return Object.assign(target, {
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
    emit(name) { for (const callback of listeners.get(name) || []) callback(); },
    listenerCount() { return [...listeners.values()].reduce((sum, set) => sum + set.size, 0); },
  });
}

function mount({ reduced = false, loaded = false, throwSeek = false, rounded = false, silentSeekRejection = false, seekRanges = [[0, 4]], staticMediaQuery, runEffects = true } = {}) {
  const frames = new Map();
  let frameId = 0;
  const media = events({ matches: reduced });
  const root = { dataset: {}, style: {} };
  const poster = { style: {} };
  let currentTime = 0;
  const video = events({
    style: {}, attributes: {}, readyState: loaded ? 2 : 0, duration: loaded ? 4 : NaN,
    seeking: false, paused: true, error: null, currentSrc: '', requests: [], playCalls: 0, loadCalls: 0, sourceRequests: [],
    seekable: { length: seekRanges.length, start: (index) => seekRanges[index][0], end: (index) => seekRanges[index][1] },
    pause() { this.paused = true; },
    play() { this.playCalls++; this.paused = false; this.emit('play'); },
    setAttribute(name, value) { this.attributes[name] = value; },
    hasAttribute(name) { return name in this.attributes; },
    removeAttribute(name) { delete this.attributes[name]; },
    load() {
      this.loadCalls++;
      this.error = null;
      this.seeking = false;
      currentTime = 0;
      this.currentSrc = this.src;
      this.readyState = this.src && loaded ? 2 : 0;
      this.duration = this.src && loaded ? 4 : NaN;
      if (this.src) this.sourceRequests.push(this.src);
    },
    finishSeek() {
      if (silentSeekRejection) currentTime = 0;
      this.seeking = false;
      this.readyState = 2;
      this.emit('seeked');
    },
  });
  Object.defineProperty(video, 'src', {
    get() { return video.attributes.src || ''; },
    set(value) { video.attributes.src = value; },
  });
  Object.defineProperty(video, 'currentTime', {
    get() { return currentTime; },
    set(value) {
      if (throwSeek) throw new Error('Paused seeks unavailable');
      video.requests.push(value);
      currentTime = rounded ? Math.round(value * 10) / 10 : value;
      video.seeking = true;
    },
  });

  const hooks = [];
  const effects = [];
  const handle = {};
  const react = {
    forwardRef: (render) => render,
    useRef(initial) {
      const ref = { current: hooks.length === 0 ? root : hooks.length === 1 ? video : hooks.length === 2 ? poster : initial };
      hooks.push(ref);
      return ref;
    },
    useImperativeHandle(ref, factory) { ref.current = factory(); },
    useEffect(effect) { effects.push(effect); },
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      if (name === 'react') return react;
      if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      if (name === 'next/image') return { default: 'Image' };
      throw new Error(`Unexpected dependency: ${name}`);
    },
    window: {
      matchMedia(query) { media.query = query; return media; },
      requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
      cancelAnimationFrame(id) { frames.delete(id); },
    },
  });
  const tree = exports.ScrollCinema({ videoSrc: '/scene.mp4', posterSrc: '/poster.jpg', staticMediaQuery }, handle);
  const cleanup = runEffects ? effects.map((effect) => effect()) : [];
  return {
    root, poster, video, media, handle: handle.current, tree, frames,
    flush() {
      const queued = [...frames.values()];
      frames.clear();
      for (const callback of queued) callback();
    },
    dispose() { for (const stop of cleanup) stop(); },
  };
}

test('retains progress until metadata, then reveals only a decoded paused frame', () => {
  const scene = mount();
  scene.handle.setProgress(0.65);
  scene.flush();
  assert.equal(scene.video.requests.length, 0);
  assert.equal(scene.root.dataset.cinemaState, 'loading');
  assert.equal(scene.poster.style.opacity, '1');
  scene.video.duration = 4;
  scene.video.readyState = 1;
  scene.video.emit('loadedmetadata');
  scene.flush();
  assert.equal(scene.video.requests[0], 0.65 * 3.999);
  assert.equal(scene.root.dataset.cinemaState, 'loading');
  scene.video.finishSeek();
  scene.flush();
  assert.equal(scene.root.dataset.cinemaState, 'ready');
  assert.equal(scene.root.dataset.cinemaPaused, 'true');
  assert.equal(scene.poster.style.opacity, '0');
  assert.equal(scene.video.playCalls, 0);
  scene.dispose();
});

test('coalesces rapid updates, freezes without scroll, and seeks backwards', () => {
  const scene = mount({ loaded: true });
  scene.flush();
  for (const value of [0.2, 0.4, 0.6]) scene.handle.setProgress(value);
  assert.equal(scene.frames.size, 1);
  scene.flush();
  assert.deepEqual(scene.video.requests, [0.6 * 3.999]);
  for (const value of [0.7, 0.8, 0.9]) scene.handle.setProgress(value);
  scene.flush();
  assert.equal(scene.video.requests.length, 1);
  scene.video.finishSeek();
  scene.flush();
  assert.deepEqual(scene.video.requests, [0.6 * 3.999, 0.9 * 3.999]);
  scene.video.finishSeek();
  scene.flush();
  const frozen = scene.video.currentTime;
  scene.flush();
  assert.equal(scene.video.currentTime, frozen);
  assert.equal(scene.frames.size, 0);
  scene.handle.setProgress(0.1);
  scene.flush();
  assert.equal(scene.video.requests.at(-1), 0.1 * 3.999);
  assert.equal(scene.video.playCalls, 0);
  scene.dispose();
});

test('reduced motion retains a static poster and resumes at the latest progress', () => {
  const scene = mount({ loaded: true, reduced: true });
  scene.handle.setProgress(0.6);
  scene.flush();
  assert.equal(scene.root.dataset.cinemaState, 'static');
  assert.equal(scene.video.requests.length, 0);
  assert.equal(scene.video.src, '');
  assert.equal(scene.video.preload, 'none');
  assert.equal(scene.video.sourceRequests.length, 0);
  scene.media.matches = false;
  scene.media.emit('change');
  scene.flush();
  assert.equal(scene.video.requests[0], 0.6 * 3.999);
  assert.equal(scene.video.src, '/scene.mp4');
  scene.media.matches = true;
  scene.media.emit('change');
  scene.video.finishSeek();
  scene.flush();
  assert.equal(scene.root.dataset.cinemaState, 'static');
  assert.equal(scene.poster.style.opacity, '1');
  assert.equal(scene.video.src, '');
  assert.equal(scene.video.playCalls, 0);
  scene.dispose();
});

test('network errors and rejected paused seeks show the poster without playback', () => {
  for (const throwSeek of [false, true]) {
    const scene = mount({ loaded: true, throwSeek });
    scene.flush();
    scene.handle.setProgress(0.4);
    scene.flush();
    if (!throwSeek) {
      scene.video.error = { code: 2 };
      scene.video.emit('error');
    }
    assert.equal(scene.root.dataset.cinemaState, 'error');
    assert.equal(scene.poster.style.opacity, '1');
    assert.equal(scene.video.style.opacity, '0');
    const requests = scene.video.requests.length;
    scene.handle.setProgress(0.8);
    scene.flush();
    assert.equal(scene.video.requests.length, requests);
    assert.equal(scene.video.playCalls, 0);
    scene.dispose();
  }
});

test('clamps progress and avoids repeatedly seeking when browser time is rounded', () => {
  const scene = mount({ loaded: true, rounded: true, seekRanges: [[0, 0]] });
  scene.handle.setProgress(Infinity);
  scene.flush();
  assert.equal(scene.root.dataset.cinemaProgress, '0');
  scene.handle.setProgress(0.313);
  scene.flush();
  scene.video.finishSeek();
  scene.flush();
  assert.equal(scene.video.requests.length, 1);
  assert.equal(scene.root.dataset.cinemaState, 'ready');
  scene.handle.setProgress(2);
  scene.flush();
  assert.equal(scene.root.dataset.cinemaProgress, '1');
  assert.equal(scene.video.requests.at(-1), 3.999);
  scene.dispose();
});

test('shows poster when a non-seekable server silently resets a large seek to zero', () => {
  for (const seekRanges of [[], [[0, 0]]]) {
    const scene = mount({ loaded: true, silentSeekRejection: true, seekRanges });
    scene.flush();
    scene.video.duration = 7;
    scene.handle.setProgress(0.5);
    scene.flush();
    assert.equal(scene.video.requests.at(-1), 0.5 * 6.999);
    scene.video.finishSeek();
    scene.flush();
    assert.equal(scene.video.currentTime, 0);
    assert.equal(scene.root.dataset.cinemaState, 'error');
    assert.equal(scene.root.dataset.cinemaFallback, 'unseekable');
    assert.equal(scene.root.dataset.cinemaReady, 'false');
    assert.equal(scene.poster.style.opacity, '1');
    assert.equal(scene.video.style.opacity, '0');
    const requestCount = scene.video.requests.length;
    scene.handle.setProgress(0.8);
    scene.flush();
    assert.equal(scene.video.requests.length, requestCount);
    assert.equal(scene.video.playCalls, 0);
    scene.dispose();
  }
});

test('SSR and no-JS markup has no video source or preload request', () => {
  const scene = mount({ runEffects: false });
  const videoNode = scene.tree.props.children[0];
  assert.equal(videoNode.props.src, undefined);
  assert.equal(videoNode.props.preload, 'none');
  assert.equal(videoNode.props.poster, '/poster.jpg');
  assert.equal(scene.video.sourceRequests.length, 0);
});

test('custom static query cancels loading and restores the latest position after re-enabling', () => {
  const query = '(prefers-reduced-motion: reduce), (max-height: 640px)';
  const scene = mount({ loaded: true, staticMediaQuery: query });
  assert.equal(scene.media.query, query);
  assert.equal(scene.video.src, '/scene.mp4');
  scene.handle.setProgress(0.8);
  scene.flush();
  scene.media.matches = true;
  scene.media.emit('change');
  assert.equal(scene.video.src, '');
  assert.equal(scene.video.preload, 'none');
  assert.equal(scene.video.seeking, false);
  const requestCount = scene.video.sourceRequests.length;
  scene.handle.setProgress(0.35);
  scene.video.error = { code: 4 };
  scene.video.emit('error');
  scene.flush();
  assert.equal(scene.root.dataset.cinemaState, 'static');
  assert.equal(scene.video.sourceRequests.length, requestCount);
  scene.media.matches = false;
  scene.media.emit('change');
  // A queued event from the unloaded source arrives after load() cleared error.
  scene.video.emit('error');
  scene.flush();
  assert.equal(scene.video.requests.at(-1), 0.35 * 3.999);
  scene.video.finishSeek();
  scene.flush();
  assert.equal(scene.root.dataset.cinemaState, 'ready');
  assert.equal(scene.root.dataset.cinemaProgress, '0.35');
  assert.equal(scene.video.playCalls, 0);
  scene.dispose();
});

test('cleans up frames, listeners and source, with inline muted non-autoplay markup', () => {
  const scene = mount({ loaded: true });
  const videoNode = scene.tree.props.children[0];
  assert.equal(videoNode.type, 'video');
  assert.equal(videoNode.props.muted, true);
  assert.equal(videoNode.props.playsInline, true);
  assert.equal(videoNode.props.preload, 'none');
  assert.equal(videoNode.props.src, undefined);
  assert.equal(scene.video.preload, 'auto');
  assert.equal(videoNode.props.controls, false);
  assert.equal(videoNode.props.autoPlay, undefined);
  assert.equal(scene.video.attributes['webkit-playsinline'], 'true');
  scene.dispose();
  assert.equal(scene.frames.size, 0);
  assert.equal(scene.video.listenerCount(), 0);
  assert.equal(scene.media.listenerCount(), 0);
  assert.equal(scene.video.src, '');
  assert.equal(scene.video.preload, 'none');
  scene.handle.setProgress(0.8);
  assert.equal(scene.frames.size, 0);
});
