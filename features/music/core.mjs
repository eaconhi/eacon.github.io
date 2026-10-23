export const VERSION = '20261023-2';
export const LAYOUTS = [
  ['rail-left', '常规竖条'], ['album-vinyl', '封面叠黑胶'], ['turntable', '深色唱机'],
  ['vinyl-pocket', '粉色唱片袋'], ['bar', '底部长条'], ['bar-ivory', '奶油长条'],
  ['bar-neon', '霓虹短条'], ['card', '居中卡片']
];
export const LYRIC_STYLES = [['center', '常规歌词'], ['vertical', '竖排歌词'], ['classic', '流光'], ['diorama', '镜台']];
export const PALETTES = [
  ['frost', '雾白', '#eef3f4', '#203340'], ['blue', '浅蓝', '#d8eaff', '#203954'],
  ['mint', '薄荷', '#d7eee3', '#203e34'], ['lilac', '淡紫', '#e7dff5', '#382b50'],
  ['rose', '柔粉', '#f6dfe7', '#4b2b39'], ['charcoal', '炭黑', '#21252e', '#f5f7fa'],
  ['midnight', '深海', '#182941', '#eaf3ff'], ['pine', '墨绿', '#20392f', '#eef7ee'],
  ['espresso', '深咖', '#3a2c28', '#fff1e6'], ['neon', '霓蓝', '#294779', '#f2f6ff']
];
const defaults = { enabled: true, layout: 'bar', palette: 'frost', opacity: 85, scale: 100, lyrics: true,
  lyricStyle: 'center', lyricSize: 36, lyricColor: '#ffffff', lyricOpacity: 100, lyricY: 40,
  lyricOffset: 0, lyricShadow: true, cache: true, cacheLimit: 256, repeat: 'queue', volume: 0.7 };
export function preferences(value = {}) {
  const p = { ...defaults };
  for (const k of ['enabled', 'lyrics', 'lyricShadow', 'cache']) if (typeof value[k] === 'boolean') p[k] = value[k];
  for (const [key, list] of [['layout', LAYOUTS], ['palette', PALETTES], ['lyricStyle', LYRIC_STYLES]])
    if (list.some(x => x[0] === value[key])) p[key] = value[key];
  for (const [key, min, max] of [['opacity', 40, 100], ['scale', 65, 140], ['lyricSize', 20, 72], ['lyricOpacity', 40, 100], ['lyricY', 15, 75], ['lyricOffset', -10, 10], ['volume', 0, 1]])
    if (Number.isFinite(value[key])) p[key] = Math.min(max, Math.max(min, value[key]));
  if ([64, 128, 256, 512, 1024].includes(value.cacheLimit)) p.cacheLimit = value.cacheLimit;
  if (['queue', 'one', 'shuffle'].includes(value.repeat)) p.repeat = value.repeat;
  if (/^#[\da-f]{6}$/i.test(value.lyricColor)) p.lyricColor = value.lyricColor;
  return p;
}
export const trackKey = track => `${track.provider}:${track.id}`;
export const formatTime = seconds => { const n = Math.max(0, Math.floor(Number(seconds) || 0)); return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`; };
export const formatBytes = bytes => bytes < 1048576 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
const timestamp = text => { const p = text.split(':').map(Number); return p.length === 2 ? p[0] * 60 + p[1] : p.reduce((a, b) => a * 60 + b, 0); };
export function parseLyrics(text, translation = '') {
  if (typeof text !== 'string' || text.length > 2 * 1024 * 1024) throw new Error('歌词文件过大');
  text=text.replace(/&#(x[\da-f]+|\d+);/gi,(_,n)=>{const value=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return value<=0x10ffff?String.fromCodePoint(value):'';}).replace(/&(lt|gt|amp|quot|apos);/g,(_,n)=>({lt:'<',gt:'>',amp:'&',quot:'"',apos:"'"}[n]));
  if (/<(?:\w+:)?tt[\s>]/i.test(text)) return parseTtml(text);
  const offset = Number(/\[offset:([+-]?\d+)\]/i.exec(text)?.[1] || 0) / 1000;
  const rows = [];
  for (const raw of text.split(/\r?\n/)) {
    const krc=/^\[(\d+),(\d+)\]/.exec(raw);
    if(krc){const start=Number(krc[1])/1000+offset;const words=[...raw.matchAll(/<(\d+),(\d+),\d+>([^<]*)/g)].map(m=>({start:start+Number(m[1])/1000,text:m[3]}));if(words.length)rows.push({start,text:words.map(x=>x.text).join(''),words});continue;}
    const times = [...raw.matchAll(/\[(\d{1,3}:\d{1,2}(?:\.\d+)?)\]/g)];
    const body = raw.replace(/\[[^\]]*\]/g, '').trim();
    if (!body) continue;
    const words = [...body.matchAll(/<(\d{1,3}:\d{1,2}(?:\.\d+)?)>([^<]*)/g)].map(m => ({ start: timestamp(m[1]) + offset, text: m[2] }));
    for (const m of times) rows.push({ start: Math.max(0, timestamp(m[1]) + offset), text: words.length ? words.map(x => x.text).join('') : body, words });
  }
  rows.sort((a, b) => a.start - b.start);
  if (translation) {
    const translated = parseLyrics(translation);
    for (const row of rows) { const r = translated.find(x => Math.abs(x.start - row.start) < 0.4); if (r) row.translation = r.text; }
  }
  if (!rows.length && text.trim()) return [{ start: 0, text: text.trim().replace(/\[[^\]]*\]/g, '').slice(0, 300), words: [], untimed: true }];
  return rows.slice(0, 10000);
}
function parseTtml(text) {
  const xml = new DOMParser().parseFromString(text, 'text/xml');
  if (xml.getElementsByTagName('parsererror').length) throw new Error('TTML 歌词格式不正确');
  const at = value => /ms$/.test(value) ? parseFloat(value) / 1000 : /s$/.test(value) ? parseFloat(value) : timestamp(value || '0');
  return [...xml.getElementsByTagNameNS('*', 'p')].map(p => ({ start: at(p.getAttribute('begin')), text: p.textContent || '',
    words: [...p.getElementsByTagNameNS('*', 'span')].filter(x => x.hasAttribute('begin')).map(x => ({ start: at(x.getAttribute('begin')), text: x.textContent || '' }))
  })).filter(x => x.text.trim()).sort((a, b) => a.start - b.start).slice(0, 10000);
}
export function lyricIndex(rows, time) {
  let lo = 0, hi = rows.length;
  while (lo < hi) { const mid = (lo + hi) >>> 1; if (rows[mid].start <= time) lo = mid + 1; else hi = mid; }
  return lo - 1;
}
export class MusicStore {
  constructor() { this.db = new Promise((resolve, reject) => { const r = indexedDB.open('xp-music-v1', 1);
    r.onupgradeneeded = () => { for (const name of ['library', 'cache']) if (!r.result.objectStoreNames.contains(name)) r.result.createObjectStore(name, { keyPath: 'key' }); };
    r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); r.onblocked = () => reject(new Error('曲库被其他页面占用，请关闭后重试')); }); }
  async run(name, mode, operation) { const db = await this.db; return new Promise((resolve, reject) => { const tx = db.transaction(name, mode), r = operation(tx.objectStore(name)); let value;
    r.onsuccess = () => value = r.result; tx.oncomplete = () => resolve(value); tx.onerror = tx.onabort = () => reject(tx.error || r.error || new Error('本机存储不可用')); }); }
  list() { return this.run('library', 'readonly', s => s.getAll()); }
  save(track, extra = {}) { return this.run('library', 'readwrite', s => s.put({ key: trackKey(track), track, ...extra })); }
  remove(track) { return this.run('library', 'readwrite', s => s.delete(trackKey(track))); }
  get(track) { return this.run('library', 'readonly', s => s.get(trackKey(track))); }
  cached(track) { return this.run('cache', 'readonly', s => s.get(trackKey(track))); }
  async cache(track, blob, lyrics, limitMB, cover = null) {
    if (!blob.size || blob.size > limitMB * 1048576) throw new Error('这首歌超过缓存容量上限');
    const entries = await this.run('cache', 'readonly', s => s.getAll());
    let total = entries.reduce((n, x) => n + x.blob.size + (x.cover?.size || 0), 0), existing = entries.find(x => x.key === trackKey(track));
    total -= existing ? existing.blob.size + (existing.cover?.size || 0) : 0;
    for (const row of entries.filter(x => x.key !== trackKey(track)).sort((a, b) => a.at - b.at)) {
      if (total + blob.size + (cover?.size || 0) <= limitMB * 1048576) break;
      await this.run('cache', 'readwrite', s => s.delete(row.key)); total -= row.blob.size + (row.cover?.size || 0);
    }
    return this.run('cache', 'readwrite', s => s.put({ key: trackKey(track), track, blob, lyrics, cover, at: Date.now() }));
  }
  async trim(limitMB) {
    const rows = (await this.run('cache', 'readonly', s => s.getAll())).sort((a, b) => a.at - b.at);
    let bytes = rows.reduce((n, x) => n + x.blob.size + (x.cover?.size || 0), 0);
    for (const row of rows) { if (bytes <= limitMB * 1048576) break; await this.run('cache', 'readwrite', s => s.delete(row.key)); bytes -= row.blob.size + (row.cover?.size || 0); }
  }
  async stats() { const rows = await this.run('cache', 'readonly', s => s.getAll()); return { count: rows.length, bytes: rows.reduce((n, x) => n + x.blob.size + (x.cover?.size || 0), 0), rows }; }
  clearCache() { return this.run('cache', 'readwrite', s => s.clear()); }
}
