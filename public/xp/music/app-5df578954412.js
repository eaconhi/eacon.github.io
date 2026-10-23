import { VERSION, LAYOUTS, LYRIC_STYLES, PALETTES, preferences, MusicStore, trackKey, formatTime, formatBytes, parseLyrics, lyricIndex } from './core-596ac8d7ad85.mjs';
import { observeDisplayState } from '../display-state-66e67203cbb9.js';

const API = 'https://music.xpeng.win';
const PREF_KEY = 'xp-music-preferences-v1';
const STORE_KEY = 'xp-music-last-track-v1';
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = (name, size = 20) => {
  const paths = { music: '<path d="M9 18V5l12-2v13M9 8l12-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="18" cy="16" rx="3" ry="2"/>',
    play: '<path d="m8 5 11 7-11 7Z"/>', pause: '<path d="M8 5v14M16 5v14"/>', close: '<path d="m6 6 12 12M18 6 6 18"/>',
    prev: '<path d="M6 5v14m12-14L7 12l11 7Z"/>', next: '<path d="M18 5v14M6 5l11 7-11 7Z"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    search: '<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>', upload: '<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>',
    settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',
    library: '<path d="M4 4v16M9 4v16m5-16 6 15"/>', cache: '<path d="M4 7h16v14H4zM2 3h20v4H2zM9 12h6"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    check: '<path d="m5 12 4 4L19 6"/>', repeat: '<path d="m17 2 4 4-4 4M3 10V6h18M7 22l-4-4 4-4m14 0v4H3"/>',
    volume: '<path d="m11 4-6 5H2v6h3l6 5Zm4 4c2 2 2 6 0 8m3-11c4 4 4 10 0 14"/>', account: '<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>' };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.music}</svg>`;
};
const builtins = [
  ['cylinder-one', 'Cylinder One'], ['cylinder-two', 'Cylinder Two'], ['cylinder-three', 'Cylinder Three'],
  ['divider-heliograph', 'Heliograph'], ['divider-oxygen-garden', 'Oxygen Garden'], ['divider-wonder-cycle', 'Wonder Cycle']
].map(([id, name]) => ({ id, name, artist: 'Chris Zabriskie', album: '氛围音乐 · CC BY 4.0', provider: 'builtin',
  url: new URL(`../temple/licensed-music/${id}.m4a`, import.meta.url).href, cover: '', license: 'https://creativecommons.org/licenses/by/4.0/' }));

let pref;
try { pref = preferences(JSON.parse(localStorage.getItem(PREF_KEY) || '{}')); } catch { pref = preferences(); }
const store = new MusicStore();
const audio = new Audio(); audio.preload = 'metadata'; audio.crossOrigin = 'anonymous'; audio.volume = pref.volume;
let tracks = [], queue = [], current = null, rows = [], currentIndex = -2, status = '', listMode = 'home', queryToken = 0, playToken = 0;
let resolvedUrl = '', localUrl = '', cachedCoverUrl = '', rawLyrics = '', rawTranslation = '', panelOpen = false, selectedTab = 'library', returnFocus = null;
let audioContext, analyser, barsData, animation, qrTimer, navidrome = null, cacheBusy = false;
let qqSession = sessionStorage.getItem('xp-music-qq-session') || '';
let qishuiSession = sessionStorage.getItem('xp-music-qishui-session') || '';
const host = document.createElement('div'); host.id = 'xpMusicHost'; host.dataset.version = VERSION;
host.style.cssText = 'position:fixed;inset:0;z-index:2147483645;pointer-events:none';
const root = host.attachShadow({ mode: 'open' });
root.innerHTML = `<link rel="stylesheet" href="${new URL('./style-eecd7b4ecae3.css?v=' + VERSION, import.meta.url).href}">
  <button class="launcher" aria-label="打开音乐曲库" title="音乐曲库">${icon('music')}<span>音乐</span></button>
  <section class="lyrics" aria-label="当前歌词" hidden><div class="lyric-rows"></div></section>
  <section class="widget" aria-label="音乐播放控件" hidden>
    <button class="art-button" title="打开音乐曲库" aria-label="打开音乐曲库"><div class="art">${icon('music', 32)}</div><div class="vinyl"></div></button>
    <div class="track-info"><button class="track-name" title="打开音乐曲库">选择音乐</button><div class="artist"></div><div class="spectrum" aria-hidden="true">${'<i></i>'.repeat(12)}</div></div>
    <div class="widget-controls"><button data-action="prev" aria-label="上一首">${icon('prev')}</button><button class="play primary-control" data-action="play" aria-label="播放">${icon('play', 24)}</button><button data-action="next" aria-label="下一首">${icon('next')}</button><button class="like" data-action="like" aria-label="收藏歌曲">${icon('heart')}</button><button data-action="open" aria-label="音乐设置">${icon('more')}</button></div>
    <div class="widget-timeline"><span class="elapsed">0:00</span><input class="seek" type="range" min="0" max="1000" value="0" aria-label="歌曲播放进度"><span class="duration">0:00</span></div>
  </section>
  <div class="backdrop" hidden><section class="panel" role="dialog" aria-modal="true" aria-label="音乐曲库" aria-labelledby="musicTitle" tabindex="-1">
    <header><div class="brand-mark">${icon('music', 24)}</div><div><p class="eyebrow">小 P桌面 · MUSIC</p><h1 id="musicTitle">我的曲库</h1></div><button class="panel-close icon-button" aria-label="关闭音乐曲库">${icon('close', 24)}</button></header>
    <nav class="tabs" aria-label="音乐功能"><button data-tab="library">${icon('library', 18)}曲库</button><button data-tab="appearance">${icon('settings', 18)}显示</button><button data-tab="cache">${icon('cache', 18)}缓存</button><button data-tab="account">${icon('account', 18)}账号</button></nav>
    <div class="panel-body">
      <section data-section="library"><form class="search-form" role="search"><label><span class="sr-only">音乐平台</span><select class="provider"><option value="kugou">酷狗</option><option value="qishui">汽水音乐</option><option value="qq">QQ 音乐</option><option value="netease">网易云</option><option value="navidrome" hidden>Navidrome</option></select></label><label class="search-input">${icon('search', 20)}<input type="search" maxlength="100" placeholder="搜索歌曲、歌手" aria-label="搜索歌曲、歌手"></label><button class="accent-button" type="submit">搜索</button></form>
        <div class="library-actions"><div class="filters"><button data-filter="home">推荐</button><button data-filter="library">我的曲库</button><button data-filter="favorites">收藏</button><button data-filter="queue">播放队列</button></div><button class="import-button">${icon('upload', 16)}导入音乐 / 歌词</button><input class="file-input" type="file" multiple accept="audio/*,.mp3,.m4a,.flac,.wav,.ogg,.opus,.lrc,.ttml" hidden></div>
        <div class="list-heading"><h2 class="list-title">给自己留一点听歌的时间</h2><span class="list-count"></span></div><p class="list-description">先听一段氛围音乐，或搜索你喜欢的歌曲。</p><div class="song-list"></div>
        <p class="library-note">氛围音乐：Chris Zabriskie · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>。在线歌曲是否可播放由平台与账号权限决定。</p>
      </section>
      <section data-section="appearance" hidden><div class="setting-heading"><h2>壁纸上的音乐</h2><label class="toggle"><input type="checkbox" data-pref="enabled"><span>显示播放控件</span></label></div>
        <h3>播放器样式</h3><div class="layout-grid">${LAYOUTS.map(([id, name], i) => `<button data-layout="${id}"><span class="mini-layout mini-${id}"><i></i><b></b><em></em></span><span>${name}</span></button>`).join('')}</div>
        <h3>主题色</h3><div class="palette-grid">${PALETTES.map(([id, name, color]) => `<button data-palette="${id}" aria-label="${name}" title="${name}"><i style="background:${color}"></i><span>${name}</span></button>`).join('')}</div>
        <div class="settings-grid">${range('opacity', '面板不透明度', 40, 100, '%')}${range('scale', '播放器大小', 65, 140, '%')}</div>
        <div class="setting-heading"><h2>歌词</h2><label class="toggle"><input type="checkbox" data-pref="lyrics"><span>显示歌词</span></label></div><div class="lyric-style-grid">${LYRIC_STYLES.map(([id, name]) => `<button data-lyric-style="${id}"><span>${id === 'vertical' ? '听<br>见<br>此<br>刻' : '听见此刻'}</span><b>${name}</b></button>`).join('')}</div>
        <div class="settings-grid">${range('lyricSize', '字号', 20, 72, 'px')}${range('lyricOpacity', '歌词不透明度', 40, 100, '%')}${range('lyricY', '垂直位置', 15, 75, '%')}${range('lyricOffset', '歌词提前 / 延后', -10, 10, '秒', 0.1)}<label class="field">文字颜色<input type="color" data-pref="lyricColor"></label><label class="toggle"><input type="checkbox" data-pref="lyricShadow"><span>文字描边与阴影</span></label></div>
        <p class="help">播放时可关闭此面板查看实际效果。纯音乐和未提供歌词的歌曲会保留封面与播放控件。</p>
      </section>
      <section data-section="cache" hidden><div class="setting-heading"><h2>离线也能继续听</h2><label class="toggle"><input type="checkbox" data-pref="cache"><span>自动缓存</span></label></div><p class="help">完整播放后保存音频、歌词和可读取的封面。导入的本地音乐独立保存在曲库中。</p>
        <div class="cache-summary"><strong class="cache-size">正在读取…</strong><span class="cache-count"></span></div><label class="field">音频缓存上限<select data-pref="cacheLimit">${[64, 128, 256, 512, 1024].map(n => `<option value="${n}">${n} MB</option>`).join('')}</select></label>
        <div class="button-row"><button class="cache-current accent-button">缓存当前歌曲</button><button class="clear-cache secondary-button">清除音乐缓存</button></div><div class="cached-list"></div><p class="help">容量用尽时先清理较早的缓存；清除缓存会保留本地导入、收藏与显示设置。浏览器也可能主动回收存储。</p>
      </section>
      <section data-section="account" hidden><h2>音乐平台</h2><p class="help">酷狗支持公开曲库搜索；QQ 音乐与汽水音乐可在下方扫码登录。网易云接口目前可能受到平台风控限制。</p>
        <article class="account-card"><h3>汽水音乐</h3><p class="qishui-state">${qishuiSession?'可检查已连接账号的登录状态':'尚未登录'}</p><div class="button-row"><button class="qishui-login accent-button">抖音扫码登录</button><button class="qishui-check secondary-button">检查汽水登录</button><button class="qishui-logout secondary-button">退出汽水登录</button></div><div class="qishui-qr qr-code" hidden></div><p class="help">仅使用你主动扫码授权的账号。播放使用平台提供的标准音质，试听曲目会标记“试听”。</p></article>
        <article class="account-card"><h3>QQ 音乐</h3><p class="qq-state">${qqSession ? '已保存本次浏览器会话，可检查登录状态' : '尚未登录'}</p><div class="button-row"><button class="qq-login accent-button">微信扫码登录</button><button class="qq-check secondary-button">检查登录</button><button class="qq-logout secondary-button" ${qqSession ? '' : 'hidden'}>退出登录</button></div><div class="qq-qr qr-code" hidden></div></article>
        <article class="account-card"><h3>连接自己的 Navidrome</h3><p class="help">连接支持跨域访问的 HTTPS 服务器。账号信息仅保留在本次页面内。</p><form class="navidrome-form"><label class="field">服务器地址<input name="server" type="url" placeholder="https://music.example.com" required></label><label class="field">用户名<input name="user" autocomplete="username" required></label><label class="field">密码<input name="password" type="password" autocomplete="current-password" required></label><button class="accent-button" type="submit">连接服务器</button><span class="navidrome-status" role="status"></span></form></article>
      </section>
    </div><footer class="panel-footer"><div class="footer-song">尚未播放</div><div class="footer-controls"><button data-action="prev" class="icon-button" aria-label="上一首">${icon('prev')}</button><button data-action="play" class="play icon-button" aria-label="播放">${icon('play', 22)}</button><button data-action="next" class="icon-button" aria-label="下一首">${icon('next')}</button><button data-action="like" class="like icon-button" aria-label="收藏歌曲">${icon('heart')}</button><button data-action="repeat" class="icon-button repeat-button" aria-label="切换循环方式" title="顺序循环">${icon('repeat')}</button><label class="volume-control">${icon('volume', 18)}<input type="range" min="0" max="1" step="0.02" value="${pref.volume}" aria-label="音量"></label></div></footer>
  </section></div><div class="toast" role="status" aria-live="polite" hidden></div>`;
function range(key, label, min, max, unit, step = 1) { return `<label class="field">${label}<span class="range-value" data-value="${key}"></span><input type="range" data-pref="${key}" min="${min}" max="${max}" step="${step}" data-unit="${unit}"></label>`; }
const $ = selector => root.querySelector(selector), $$ = selector => [...root.querySelectorAll(selector)];
document.body.append(host);
let presenting = false;
function showToast(message) { status = message; const box = $('.toast'); box.textContent = message; box.hidden = false; clearTimeout(showToast.timer); showToast.timer = setTimeout(() => box.hidden = true, 6000); }
function persistPreferences() { try { localStorage.setItem(PREF_KEY, JSON.stringify(pref)); } catch { showToast('显示设置暂时无法保存'); } }
function applyPreferences() {
  const [, , bg, ink] = PALETTES.find(x => x[0] === pref.palette), widget = $('.widget');
  widget.dataset.layout = pref.layout; widget.style.setProperty('--music-bg', bg); widget.style.setProperty('--music-ink', ink);
  widget.style.setProperty('--panel-alpha', pref.opacity / 100); widget.style.setProperty('--player-scale', pref.scale / 100);
  widget.hidden = !presenting || !pref.enabled || !current; $('.launcher').hidden = presenting && !!current && pref.enabled;
  host.dataset.presentation = String(presenting);
  if(!widget.hidden&&widget.offsetWidth)widget.style.setProperty('--player-scale',Math.max(.1,Math.min(pref.scale/100,(innerWidth-32)/widget.offsetWidth,Math.max(1,innerHeight-165)/widget.offsetHeight)));
  const lyrics = $('.lyrics'); lyrics.dataset.style = pref.lyricStyle; lyrics.dataset.shadow = pref.lyricShadow;
  lyrics.style.setProperty('--lyric-size', pref.lyricSize + 'px'); lyrics.style.setProperty('--lyric-color', pref.lyricColor);
  lyrics.style.opacity = pref.lyricOpacity / 100; lyrics.style.top = pref.lyricY + '%';
  lyrics.hidden = !presenting || !pref.enabled || !pref.lyrics || !current || !rows.length;
  for (const input of $$('[data-pref]')) { const key = input.dataset.pref; if (input.type === 'checkbox') input.checked = pref[key]; else input.value = pref[key]; }
  for (const out of $$('[data-value]')) { const key = out.dataset.value, input = $(`[data-pref="${key}"]`); out.textContent = pref[key] + (input?.dataset.unit || ''); }
  for (const button of $$('[data-layout]')) button.setAttribute('aria-pressed', String(button.dataset.layout === pref.layout));
  for (const button of $$('[data-palette]')) button.setAttribute('aria-pressed', String(button.dataset.palette === pref.palette));
  for (const button of $$('[data-lyric-style]')) button.setAttribute('aria-pressed', String(button.dataset.lyricStyle === pref.lyricStyle));
  audio.volume = pref.volume;
}
function openPanel(tab = 'library') {
  if (!panelOpen) returnFocus = root.activeElement || document.activeElement;
  panelOpen = true; $('.backdrop').hidden = false; selectedTab = tab;
  for (const section of $$('[data-section]')) section.hidden = section.dataset.section !== tab;
  for (const button of $$('[data-tab]')) button.setAttribute('aria-current', String(button.dataset.tab === tab));
  if (tab === 'cache') updateCache();
  $('.panel').focus();
}
function closePanel() { panelOpen = false; $('.backdrop').hidden = true; stopQr(); returnFocus?.focus?.(); }
$('.launcher').onclick = () => openPanel(); $('.art-button').onclick = () => openPanel(); $('.track-name').onclick = () => openPanel(); $('.panel-close').onclick = closePanel;
$('.backdrop').onclick = e => { if (e.target === $('.backdrop')) closePanel(); };
root.addEventListener('keydown', event => {
  if (!panelOpen) return;
  if (event.key === 'Escape') { event.stopPropagation(); closePanel(); }
  if (event.key === 'Tab') { const controls = $$('button:not(:disabled), input:not(:disabled), select, a[href]').filter(x => $('.panel').contains(x) && x.getClientRects().length);
    const first = controls[0], last = controls.at(-1); if (event.shiftKey && (root.activeElement === first || root.activeElement === $('.panel'))) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && root.activeElement === last) { event.preventDefault(); first?.focus(); } }
});
for (const button of $$('[data-tab]')) button.onclick = () => openPanel(button.dataset.tab);
for (const button of $$('[data-layout]')) button.onclick = () => { pref.layout = button.dataset.layout; if (pref.layout === 'turntable') pref.palette = 'espresso'; if (pref.layout === 'vinyl-pocket') pref.palette = 'rose'; persistPreferences(); applyPreferences(); };
for (const button of $$('[data-palette]')) button.onclick = () => { pref.palette = button.dataset.palette; persistPreferences(); applyPreferences(); };
for (const button of $$('[data-lyric-style]')) button.onclick = () => { pref.lyricStyle = button.dataset.lyricStyle; currentIndex = -2; persistPreferences(); applyPreferences(); updateTime(); };
for (const input of $$('[data-pref]')) input.oninput = async () => {
  const key = input.dataset.pref; pref = preferences({ ...pref, [key]: input.type === 'checkbox' ? input.checked : input.type === 'range' || key === 'cacheLimit' ? Number(input.value) : input.value });
  persistPreferences(); applyPreferences(); if (key === 'cacheLimit') { try { await store.trim(pref.cacheLimit); await updateCache(); } catch (e) { showToast(e.message); } }
};
const sourceNames = { builtin: '氛围音乐', local: '本地', netease: '网易云', qq: 'QQ 音乐', kugou: '酷狗', qishui:'汽水音乐', navidrome: 'Navidrome' };
function isFavorite(track) { return tracks.find(x => x.key === trackKey(track))?.favorite === true; }
function renderTracks(list, title, description = '') {
  $('.list-title').textContent = title; $('.list-count').textContent = list.length ? `${list.length} 首` : ''; $('.list-description').textContent = description;
  $('.song-list').replaceChildren();
  if (!list.length) { $('.song-list').innerHTML = `<div class="empty">${icon('music', 36)}<strong>这里还没有歌曲</strong><span>可以搜索音乐、收藏歌曲，或导入自己的音频文件。</span></div>`; return; }
  for (const [index, track] of list.entries()) {
    const row = document.createElement('article'); row.className = 'song-row'; row.dataset.key = trackKey(track); row.classList.toggle('current', current && trackKey(current) === trackKey(track));
    row.innerHTML = `<span class="song-number">${String(index + 1).padStart(2, '0')}</span><button class="song-art" aria-label="播放 ${escape(track.name)}">${track.cover ? `<img alt="" loading="lazy" referrerpolicy="no-referrer" src="${escape(track.cover)}">` : icon('music', 22)}</button><button class="song-title"><strong>${escape(track.name)}</strong><span>${escape(track.artist || '未知歌手')}<i> · ${escape(sourceNames[track.provider] || '')}</i></span></button><span class="song-duration">${track.duration ? formatTime(track.duration) : '—'}</span><button class="row-favorite icon-button" aria-label="${isFavorite(track) ? '取消收藏' : '收藏'} ${escape(track.name)}" aria-pressed="${isFavorite(track)}">${icon('heart', 18)}</button>${listMode === 'library' ? `<button class="remove-song icon-button" aria-label="从曲库移除 ${escape(track.name)}">${icon('close', 17)}</button>` : ''}`;
    row.querySelector('.song-art').onclick = row.querySelector('.song-title').onclick = () => { queue = list; playTrack(track); };
    row.querySelector('.row-favorite').onclick = () => toggleFavorite(track);
    row.querySelector('.remove-song')?.addEventListener('click', async () => { if (track.provider === 'local' && !confirm('从曲库移除这首本地音乐？原始文件不会被删除。')) return; try { await store.remove(track); tracks = await store.list(); showList('library'); } catch (e) { showToast(e.message); } });
    row.querySelector('img')?.addEventListener('error', e => e.currentTarget.hidden = true, { once: true });
    $('.song-list').append(row);
  }
}
function showList(mode) { listMode = mode; for (const button of $$('[data-filter]')) button.setAttribute('aria-current', String(button.dataset.filter === mode));
  if (mode === 'home') renderTracks(builtins, '给自己留一点听歌的时间', '免登录的氛围音乐。也可以搜索你喜欢的歌曲。');
  if (mode === 'library') renderTracks(tracks.map(x => x.track), '我的曲库', '导入与听过的歌曲保存在当前浏览器。');
  if (mode === 'favorites') renderTracks(tracks.filter(x => x.favorite).map(x => x.track), '我的收藏', '这里的收藏保存在本机，不会改动音乐平台账号。');
  if (mode === 'queue') renderTracks(queue, '播放队列', '选择任意歌曲继续播放。');
}
for (const button of $$('[data-filter]')) button.onclick = () => showList(button.dataset.filter);
async function api(path, options = {}) {
  const headers = new Headers(options.headers); if (qqSession) headers.set('X-QQ-Session', qqSession);
  if(qishuiSession)headers.set('X-Qishui-Session',qishuiSession);
  const response = await fetch(API + path, { ...options, headers, signal: options.signal || AbortSignal.timeout(25000) });
  const nextQishui=response.headers.get('X-Qishui-Session');if(nextQishui){qishuiSession=nextQishui;sessionStorage.setItem('xp-music-qishui-session',nextQishui);}
  let d; try { d = await response.json(); } catch { throw new Error('音乐服务暂未返回有效数据，请稍后重试'); }
  if (!response.ok || d.ok === false || d.code && ![0, 200, 800, 801, 802, 803].includes(d.code)) throw new Error(d.error?.message || d.error || d.message || '音乐服务暂不可用');
  return d;
}
async function qishui(operation,params={}){return (await api('/api/qishui',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({operation,params})})).data;}
$('.search-form').onsubmit = async event => {
  event.preventDefault(); const q = $('.search-input input').value.trim(), provider = $('.provider').value; if (!q) return;
  const token = ++queryToken; listMode = 'search'; $('.song-list').innerHTML = '<div class="empty" role="status">正在搜索…</div>'; $('.list-title').textContent = q;
  for (const b of $$('[data-filter]')) b.setAttribute('aria-current', 'false');
  try { const songs = provider === 'navidrome' ? await navidromeSearch(q) : provider==='qishui'?(await qishui('search',{query:q,limit:25,offset:0})).songs:(await api(`/v1/search?provider=${provider}&q=${encodeURIComponent(q)}`)).songs;
    if (token === queryToken) renderTracks(songs || [], `“${q}”的搜索结果`, provider === 'qq' && !qqSession ? 'QQ 音乐部分查询需要登录，可在账号页扫码。' : '歌曲播放权限由所属平台决定。');
  } catch (e) { if (token !== queryToken) return; renderTracks([], '搜索暂未完成', e.message); showToast(e.message); }
};
async function remember(track, extra = {}) { const saved = await store.get(track); await store.save(track, { ...saved, ...extra, key: trackKey(track), track }); tracks = await store.list(); }
async function toggleFavorite(track = current) { if (!track) return; try { await remember(track, { favorite: !isFavorite(track) }); updatePlayer(); if (['library', 'favorites'].includes(listMode)) showList(listMode); else for (const row of $$('.song-row')) if (row.dataset.key === trackKey(track)) row.querySelector('.row-favorite').setAttribute('aria-pressed', String(isFavorite(track))); } catch (e) { showToast('收藏未保存：' + e.message); } }
function unlockAudio() {
  try { if (!audioContext) { const Context = window.AudioContext || window.webkitAudioContext; if (!Context) return; audioContext = new Context(); analyser = audioContext.createAnalyser(); analyser.fftSize = 64; const source = audioContext.createMediaElementSource(audio); source.connect(analyser); analyser.connect(audioContext.destination); barsData = new Uint8Array(analyser.frequencyBinCount); } audioContext.resume().catch(() => {}); } catch { /* Playback remains available without a spectrum. */ }
}
async function playTrack(track, { autoplay = true } = {}) {
  const token = ++playToken; if (autoplay) unlockAudio(); audio.pause(); stopSpectrum();
  if (localUrl) URL.revokeObjectURL(localUrl); if (cachedCoverUrl) URL.revokeObjectURL(cachedCoverUrl); localUrl = cachedCoverUrl = '';
  current = { ...track }; rows = []; currentIndex = -2; rawLyrics = rawTranslation = ''; resolvedUrl = ''; updatePlayer(); applyPreferences();
  try {
    const saved = await store.get(track), cached = await store.cached(track); if (token !== playToken) return;
    if (track.provider === 'local') { if (!saved?.blob) throw new Error('本地文件已不在曲库，请重新导入'); localUrl = URL.createObjectURL(saved.blob); resolvedUrl = localUrl; rawLyrics = saved.lyrics || ''; }
    else if (cached?.blob) { localUrl = URL.createObjectURL(cached.blob); resolvedUrl = localUrl; rawLyrics = cached.lyrics?.lrc || ''; rawTranslation = cached.lyrics?.translation || ''; if (cached.cover) { cachedCoverUrl = URL.createObjectURL(cached.cover); current.cover = cachedCoverUrl; } }
    else if (track.provider === 'builtin') resolvedUrl = track.url;
    else if (track.provider === 'navidrome') { if (!navidrome) throw new Error('请先在账号页重新连接 Navidrome'); resolvedUrl = navidromeUrl('stream', { id: track.id }); if(track.coverId)current.cover=navidromeUrl('getCoverArt',{id:track.coverId,size:300}); }
    else { const d = track.provider==='qishui'?await qishui('audio',{id:String(track.id),quality:'standard'}):await api(`/v1/play?provider=${track.provider}&id=${encodeURIComponent(track.id)}`); if (token !== playToken) return; resolvedUrl = d.url; current = { ...current, ...d.detail,preview:!!d.preview,clipStartMs:d.clipStartMs||0 };if(d.preview)showToast('当前歌曲为平台提供的试听片段'); }
    if (token !== playToken) return;
    if(saved?.lyrics)rawLyrics=saved.lyrics;
    audio.src = resolvedUrl; audio.load(); updatePlayer();
    if (rawLyrics) rows = parseLyrics(rawLyrics, rawTranslation);
    if (autoplay) await audio.play();
    if (token !== playToken) return;
    await remember({ ...current, cover: track.provider==='navidrome'?'':track.cover || '', url: track.provider === 'builtin' ? track.url : undefined });
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ ...track })); } catch {}
    if (!rawLyrics && saved?.lyrics) { rawLyrics = saved.lyrics; rows = parseLyrics(rawLyrics); }
    if (!rawLyrics && ['netease', 'qq', 'kugou','qishui'].includes(track.provider)) {
      try { const d = track.provider==='qishui'?await qishui('lyrics',{id:String(track.id)}):await api(`/v1/lyrics?provider=${track.provider}&id=${encodeURIComponent(track.id)}`); if (token !== playToken) return; rawLyrics = d.lrc || d.lyric_entity?.content?.replace(/\u0000/g,'') || ''; rawTranslation = d.translation || d.lang_translations?.['zh-CN']?.content || ''; rows = parseLyrics(rawLyrics, rawTranslation); }
      catch { if (token === playToken) showToast('歌曲已开始播放，歌词暂未获取成功'); }
    }
    if (token === playToken) { applyPreferences(); updateTime(); updatePlayer(); }
  } catch (e) { if (token === playToken) { showToast(e.name === 'NotAllowedError' ? '请点击播放按钮开始音乐' : e.message); updatePlayer(); } }
}
function updatePlayer() {
  const playing = !!current && !audio.paused; $('.widget').dataset.playing = playing;
  $('.track-name').textContent = current?.name || '选择音乐'; $('.artist').textContent = (current?.artist || '')+(current?.preview?' · 试听':'');
  $('.footer-song').textContent = current ? `${current.name} · ${current.artist || sourceNames[current.provider]}` : '尚未播放';
  const art = $('.art'); art.replaceChildren(); if (current?.cover) { const image = new Image(); image.alt = ''; image.referrerPolicy = 'no-referrer'; image.src = current.cover; image.onerror = () => image.remove(); art.append(image); } else art.innerHTML = icon('music', 30);
  for (const button of $$('.play')) { button.innerHTML = icon(playing ? 'pause' : 'play', 22); button.setAttribute('aria-label', playing ? '暂停' : '播放'); }
  for (const button of $$('.like')) button.setAttribute('aria-pressed', String(current && isFavorite(current)));
  for (const row of $$('.song-row')) row.classList.toggle('current', !!current && row.dataset.key === trackKey(current));
  if ('mediaSession' in navigator && current) { try { navigator.mediaSession.metadata = new MediaMetadata({ title: current.name, artist: current.artist || '', album: current.album || '', artwork: current.cover && current.provider!=='navidrome' ? [{ src: current.cover }] : [] }); navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'; } catch {} }
}
function updateTime() {
  const duration = Number.isFinite(audio.duration) ? audio.duration : current?.duration || 0;
  $('.elapsed').textContent = formatTime(audio.currentTime); $('.duration').textContent = formatTime(duration);
  $('.seek').disabled = !duration; $('.seek').value = duration ? audio.currentTime / duration * 1000 : 0;
  if (!rows.length) return;
  const at = audio.currentTime + pref.lyricOffset+(current?.clipStartMs||0)/1000, nextIndex = lyricIndex(rows, at);
  if (currentIndex !== nextIndex) { currentIndex = nextIndex; const displayIndex = Math.max(0, nextIndex), container = $('.lyric-rows'); container.replaceChildren();
    for (let i = Math.max(0, displayIndex - 1); i <= Math.min(rows.length - 1, displayIndex + 2); i++) {
      const row = rows[i], line = document.createElement('div'); line.className = 'lyric-line'; line.classList.toggle('active', i === nextIndex); line.dataset.start = row.start;
      if (row.words?.length) for (const word of row.words) { const span = document.createElement('span'); span.textContent = word.text; span.dataset.wordStart = word.start; line.append(span); } else line.textContent = row.text;
      if (row.translation) { const translation = document.createElement('small'); translation.textContent = row.translation; line.append(translation); }
      container.append(line);
    }
  }
  for (const span of $$('[data-word-start]')) span.classList.toggle('lit', Number(span.dataset.wordStart) <= at);
}
function stopSpectrum() { cancelAnimationFrame(animation); animation = null; for (const bar of $$('.spectrum i')) bar.style.height = '3px'; }
function startSpectrum() { stopSpectrum(); if (!analyser || audio.paused || document.hidden) return;
  const frame = () => { if (audio.paused || document.hidden) return stopSpectrum(); analyser.getByteFrequencyData(barsData); $$('.spectrum i').forEach((bar, i) => bar.style.height = Math.max(3, barsData[i * 2] / 255 * 18) + 'px'); animation = requestAnimationFrame(frame); }; frame(); }
audio.addEventListener('play', () => { updatePlayer(); startSpectrum(); }); audio.addEventListener('pause', () => { updatePlayer(); stopSpectrum(); });
audio.addEventListener('timeupdate', updateTime); audio.addEventListener('loadedmetadata', updateTime);
audio.addEventListener('error', () => { if (current) showToast('音频无法播放，可能是平台限制、链接到期或网络中断，请重新选择歌曲'); updatePlayer(); });
audio.addEventListener('ended', () => { if (pref.cache && current && current.provider !== 'local') cacheCurrent(true).catch(() => {}); nextTrack(1); });
document.addEventListener('visibilitychange', () => document.hidden ? stopSpectrum() : startSpectrum());
$('.seek').oninput = e => { if (Number.isFinite(audio.duration)) audio.currentTime = Number(e.target.value) / 1000 * audio.duration; updateTime(); };
$('.volume-control input').oninput = e => { pref.volume = Number(e.target.value); audio.volume = pref.volume; persistPreferences(); };
async function togglePlay() { if (!current) return openPanel(); unlockAudio(); if (audio.paused) { if (!audio.src || audio.error) return playTrack(current); try { await audio.play(); } catch (e) { showToast(e.message); } } else audio.pause(); }
function nextTrack(direction) { if (!queue.length) { if (pref.repeat === 'one' && current) { audio.currentTime = 0; audio.play().catch(() => {}); } return; }
  const index = queue.findIndex(x => trackKey(x) === trackKey(current || {})); const next = pref.repeat === 'shuffle' ? Math.floor(Math.random() * queue.length) : pref.repeat === 'one' && audio.ended ? Math.max(0, index) : (index + direction + queue.length) % queue.length; playTrack(queue[next]); }
for (const button of $$('[data-action]')) button.onclick = () => {
  const action = button.dataset.action; if (action === 'play') togglePlay(); if (action === 'prev') nextTrack(-1); if (action === 'next') nextTrack(1); if (action === 'like') toggleFavorite(); if (action === 'open') openPanel('appearance');
  if (action === 'repeat') { pref.repeat = ['queue', 'one', 'shuffle'][(['queue', 'one', 'shuffle'].indexOf(pref.repeat) + 1) % 3]; persistPreferences(); const text = { queue: '顺序循环', one: '单曲循环', shuffle: '随机播放' }[pref.repeat]; button.title = text; showToast(text); }
};
if ('mediaSession' in navigator) for (const [action, handler] of [['play', togglePlay], ['pause', () => audio.pause()], ['previoustrack', () => nextTrack(-1)], ['nexttrack', () => nextTrack(1)]]) try { navigator.mediaSession.setActionHandler(action, handler); } catch {}
$('.import-button').onclick = () => $('.file-input').click();
$('.file-input').onchange = async event => {
  const fileInput=event.currentTarget;
  const files = [...fileInput.files], lyricFiles = files.filter(x => /\.(lrc|ttml)$/i.test(x.name)), audioFiles = files.filter(x => /^audio\//.test(x.type) || /\.(mp3|m4a|flac|wav|ogg|opus)$/i.test(x.name));
  const stem = name => name.replace(/\.[^.]+$/, '').toLowerCase(); let imported = 0;
  try {
    for (const file of audioFiles) {
      const id = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${file.name}:${file.size}:${file.lastModified}`)))].map(x => x.toString(16).padStart(2, '0')).join('').slice(0, 24);
      const track = { provider: 'local', id, name: file.name.replace(/\.[^.]+$/, ''), artist: '本地音乐', duration: 0, cover: '' };
      const lyric = lyricFiles.find(x => stem(x.name) === stem(file.name)); const lyrics = lyric ? await lyric.text() : '';
      if (lyrics) parseLyrics(lyrics); await store.save(track, { blob: file, lyrics, favorite: false }); imported++;
    }
    if (!audioFiles.length && lyricFiles.length) { if (!current) throw new Error('请先播放一首歌，再导入对应歌词'); const text = await lyricFiles[0].text(); rows = parseLyrics(text); rawLyrics = text; rawTranslation = ''; await remember(current, { lyrics: text }); currentIndex = -2; applyPreferences(); updateTime(); imported++; }
    tracks = await store.list(); showList('library'); showToast(`已导入 ${imported} 个${audioFiles.length ? '音乐文件' : '歌词文件'}`);
  } catch (e) { showToast(e.name === 'QuotaExceededError' ? '浏览器存储空间不足，请清理缓存后重试' : e.message); } finally { fileInput.value = ''; }
};
async function cacheCurrent(silent = false) {
  if (!current || !resolvedUrl) { if (!silent) showToast('请先播放一首歌曲'); return; }
  if (current.provider === 'local') { if (!silent) showToast('本地导入的音乐已经保存在曲库中'); return; }
  if (cacheBusy) return;
  cacheBusy = true; const coverUrl=current.cover; const track = { ...current, cover: current.provider==='navidrome'||current.cover?.startsWith('blob:') ? '' : current.cover }, url = resolvedUrl, lyrics = { lrc: rawLyrics, translation: rawTranslation };
  try {
    if (!silent) showToast('正在缓存当前歌曲…');
    const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
    if (!response.ok || !/^(audio\/|video\/mp4|application\/octet-stream)/i.test(response.headers.get('Content-Type') || '')) throw new Error('音频不允许缓存或网络暂不可用');
    if (Number(response.headers.get('Content-Length')) > Math.min(pref.cacheLimit, 128) * 1048576) throw new Error('音频文件超过单首缓存上限');
    const reader = response.body.getReader(), chunks = []; let bytes = 0;
    try { for (;;) { const r = await reader.read(); if (r.done) break; bytes += r.value.byteLength; if (bytes > Math.min(pref.cacheLimit, 128) * 1048576) throw new Error('音频文件超过单首缓存上限'); chunks.push(r.value); } } finally { reader.cancel().catch(() => {}); }
    const blob = new Blob(chunks, { type: response.headers.get('Content-Type') }); let cover = null;
    if (coverUrl) try { const r = await fetch(coverUrl, { signal: AbortSignal.timeout(5000) }); if (r.ok && /^image\//.test(r.headers.get('Content-Type') || '')) { const b = await r.blob(); if (b.size <= 3 * 1048576) cover = b; } } catch {}
    await store.cache(track, blob, lyrics, pref.cacheLimit, cover); if (!silent) showToast('已缓存音频与歌词，可离线播放'); if (selectedTab === 'cache' && panelOpen) updateCache();
  } catch (e) { if (!silent) showToast(e.name === 'QuotaExceededError' ? '浏览器存储空间不足，请清理后重试' : e.message); } finally { cacheBusy = false; }
}
async function updateCache() { try { const stats = await store.stats(); $('.cache-size').textContent = formatBytes(stats.bytes); $('.cache-count').textContent = `${stats.count} 首已缓存 · 上限 ${pref.cacheLimit} MB`; $('.cached-list').replaceChildren();
    for (const row of stats.rows) { const button = document.createElement('button'); button.className = 'cached-track'; button.textContent = `${row.track.name} · ${formatBytes(row.blob.size)}`; button.onclick = () => { queue = stats.rows.map(x => x.track); playTrack(row.track); }; $('.cached-list').append(button); }
  } catch (e) { $('.cache-size').textContent = '缓存暂不可读取'; showToast(e.message); } }
$('.cache-current').onclick = () => cacheCurrent(); $('.clear-cache').onclick = async () => { if (!confirm('清除音乐、歌词和封面缓存？本地导入、收藏和设置会保留。')) return; try { await store.clearCache(); await updateCache(); showToast('音乐缓存已清除'); } catch (e) { showToast(e.message); } };
function stopQr() { clearInterval(qrTimer); qrTimer = null; }
function saveQqSession(value) { qqSession = value; if (value) sessionStorage.setItem('xp-music-qq-session', value); else sessionStorage.removeItem('xp-music-qq-session'); $('.qq-logout').hidden = !value; }
$('.qq-login').onclick = async () => {
  stopQr(); const qr = $('.qq-qr'); qr.hidden = false; qr.textContent = '正在生成微信登录二维码…';
  try { const key = (await api('/api/qq/login/qr/key?channel=wechat')).data?.unikey; if (!key) throw new Error('QQ 音乐暂未生成二维码，请稍后重试');
    const created = await api('/api/qq/login/qr/create?key=' + encodeURIComponent(key)); const imageUrl = created.data?.qrimg;
    if (!imageUrl || !/^(data:image\/|https:\/\/)/.test(imageUrl)) throw new Error('登录二维码暂不可用');
    const image = new Image(); image.alt = '使用微信扫码登录 QQ 音乐'; image.src = imageUrl; qr.replaceChildren(image); const hint = document.createElement('p'); hint.textContent = '使用微信扫码并在手机确认。二维码仅用于登录你的 QQ 音乐。'; qr.append(hint);
    let polling = false, count = 0;
    qrTimer = setInterval(async () => { if (polling || !panelOpen) return; if (++count > 55) { stopQr(); hint.textContent = '二维码已到期，请重新生成'; return; } polling = true;
      try { const d = await api('/api/qq/login/qr/check?key=' + encodeURIComponent(key)); const token = d.data?.sessionToken || d.sessionToken || d.data?.session || /(?:^|;\s*)qqmusic_session=([^;]+)/.exec(d.cookie || '')?.[1];
        if (token && typeof token === 'string') { saveQqSession(token); stopQr(); qr.hidden = true; $('.qq-state').textContent = '登录成功'; showToast('QQ 音乐已登录'); }
        else if ([802, 803].includes(d.code)) hint.textContent = d.code === 802 ? '已扫码，请在手机确认' : '登录确认中…';
      } catch (e) { stopQr(); hint.textContent = e.message; } finally { polling = false; }
    }, 3000);
  } catch (e) { qr.textContent = e.message; }
};
$('.qq-check').onclick = async () => { try { const d = await api('/api/qq/login/status'); $('.qq-state').textContent = d.data?.profile ? '账号已登录' : '尚未登录或会话已过期，请重新扫码'; } catch (e) { $('.qq-state').textContent = e.message; } };
$('.qq-logout').onclick = async () => { try { await api('/api/qq/logout'); } catch {} saveQqSession(''); stopQr(); $('.qq-qr').hidden = true; $('.qq-state').textContent = '已退出本浏览器登录'; };
$('.qishui-login').onclick=async()=>{
  stopQr();const box=$('.qishui-qr');box.hidden=false;box.textContent='正在生成汽水音乐授权二维码…';
  try{const key=(await qishui('login_qr_key')).key;const created=await qishui('login_qr_create',{key});
    if(!/^(?:https:\/\/|data:image\/)/.test(created.imageUrl||''))throw new Error('汽水音乐暂未提供二维码');
    const image=new Image();image.alt='使用抖音扫码授权汽水音乐';image.src=created.imageUrl;const hint=document.createElement('p');hint.textContent='使用抖音扫码，并在手机上确认汽水音乐授权';box.replaceChildren(image,hint);
    let polling=false,count=0;
    qrTimer=setInterval(async()=>{if(polling||!panelOpen)return;if(++count>90){stopQr();hint.textContent='二维码已过期，请重新生成';return;}polling=true;
      try{const d=await qishui('login_qr_check',{key});if(d.state==='confirmed'){stopQr();box.hidden=true;$('.qishui-state').textContent='汽水音乐已登录';$('.provider').value='qishui';localStorage.setItem('xp-music-source-v1','qishui');showToast('汽水音乐登录成功');}
        else if(['expired','cancelled','error'].includes(d.state)){stopQr();hint.textContent='授权已结束，请重新生成二维码';}else if(d.state==='scanned')hint.textContent='已扫码，请在手机确认授权';
      }catch(e){stopQr();hint.textContent=e.message;}finally{polling=false;}
    },3000);
  }catch(e){box.textContent=e.message;}
};
$('.qishui-check').onclick=async()=>{try{const user=await qishui('login_status');$('.qishui-state').textContent=user?`已登录${user.nickname?' · '+user.nickname:''}`:'尚未登录，请使用抖音扫码';}catch(e){$('.qishui-state').textContent=e.message;}};
$('.qishui-logout').onclick=async()=>{try{await qishui('logout');}catch{}qishuiSession='';sessionStorage.removeItem('xp-music-qishui-session');stopQr();$('.qishui-qr').hidden=true;$('.qishui-state').textContent='已退出汽水音乐登录';};
function navidromeUrl(action, params = {}) { if (!navidrome) throw new Error('请先连接 Navidrome'); const url = new URL(navidrome.server + '/rest/' + action + '.view'); const encoded = [...new TextEncoder().encode(navidrome.password)].map(x => x.toString(16).padStart(2, '0')).join('');
  for (const [key, value] of Object.entries({ u: navidrome.user, p: 'enc:' + encoded, v: '1.16.1', c: 'XiaoPDesktop', f: 'json', ...params })) url.searchParams.set(key, value); return url.href; }
async function navidromeRequest(action, params = {}) { const r = await fetch(navidromeUrl(action, params), { signal: AbortSignal.timeout(15000) }); const d = (await r.json())['subsonic-response']; if (!r.ok || d?.status !== 'ok') throw new Error(d?.error?.message || 'Navidrome 连接失败，请检查账号及跨域设置'); return d; }
async function navidromeSearch(q) { const d = await navidromeRequest('search3', { query: q, songCount: 30, albumCount: 0, artistCount: 0 }); return (d.searchResult3?.song || []).map(x => ({ provider: 'navidrome', id: String(x.id), name: x.title, artist: x.artist, album: x.album, duration: x.duration, coverId:x.coverArt||'', cover:'' })); }
$('.navidrome-form').onsubmit = async event => { event.preventDefault(); const data = new FormData(event.target), server = String(data.get('server')).replace(/\/$/, '');
  try { if (new URL(server).protocol !== 'https:') throw new Error('请输入 HTTPS 服务器地址'); navidrome = { server, user: String(data.get('user')), password: String(data.get('password')) }; await navidromeRequest('ping'); $('.provider option[value="navidrome"]').hidden = false; $('.provider').value = 'navidrome'; $('.navidrome-status').textContent = '连接成功，可在曲库页搜索'; }
  catch (e) { navidrome = null; $('.navidrome-status').textContent = e.message; }
};
// Expose a small public integration surface; the existing wallpaper and sensor modules stay independent.
window.XPMusic = Object.freeze({ open: openPanel, pause: () => audio.pause(), version: VERSION });
document.addEventListener('xp:open-music', () => openPanel());
window.addEventListener('resize',applyPreferences);
const stopDisplayObserver=observeDisplayState(state=>{
  presenting=state.active;
  if(host.parentElement!==state.host)state.host.append(host);
  applyPreferences();
});
// Keep keys and taps on the player from triggering the wallpaper/clock controls.
for(const event of ['pointerdown','click','keydown'])host.addEventListener(event,event=>event.stopPropagation());
window.addEventListener('pagehide',stopDisplayObserver,{once:true});
applyPreferences(); showList('home');
try{const savedSource=localStorage.getItem('xp-music-source-v1');if(['kugou','qq','netease','qishui'].includes(savedSource))$('.provider').value=savedSource;}catch{}
$('.provider').onchange=()=>{try{localStorage.setItem('xp-music-source-v1',$('.provider').value);}catch{}};
store.list().then(async list => { tracks = list; try { const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); if (saved && list.some(x => x.key === trackKey(saved))) { current = saved; updatePlayer(); applyPreferences(); /* Restoring never starts audio without a gesture. */ } } catch {} }).catch(e => showToast('本机曲库暂不可用：' + e.message));
