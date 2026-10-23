// Public catalog adapters. Restricted tracks retain the platform's access checks.
export const cleanText = value => String(value || '').replace(/<[^>]*>/g, '').slice(0, 250);
export const normalizeNetease = x => ({
  provider: 'netease', id: String(x.id), name: cleanText(x.name),
  artist: (x.artists || x.ar || []).map(a => cleanText(a.name)).join(' / '),
  album: cleanText((x.album || x.al)?.name),
  cover: (x.album || x.al)?.picUrl || '', duration: (x.duration || x.dt || 0) / 1000
});
export const normalizeKugou = x => ({
  provider: 'kugou', id: String(x.FileHash || x.hash || '').toLowerCase(),
  name: cleanText(x.SongName || x.songname || x.FileName || x.filename),
  artist: cleanText(x.SingerName || x.singername), album: cleanText(x.AlbumName || x.album_name),
  albumId: String(x.AlbumID || x.album_id || ''), cover: '', duration: Number(x.Duration || x.duration || 0)
});
export function normalizeQq(x) {
  return { provider: 'qq', id: String(x.mid || x.songmid || x.songMid || ''),
    songId: String(x.id || x.songid || ''), name: cleanText(x.title || x.name || x.songname),
    artist: (x.singer || x.artists || []).map(a => cleanText(a.name)).join(' / '),
    album: cleanText(x.album?.name || x.albumname), duration: Number(x.interval || x.duration || 0),
    cover: x.album?.mid || x.albummid ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${x.album?.mid || x.albummid}.jpg` : '' };
}
export function songArray(value) {
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value)) return value.length && value[0] && typeof value[0] === 'object' && ('mid' in value[0] || 'songmid' in value[0] || 'title' in value[0]) ? value : [];
  for (const k of ['items', 'list', 'song', 'songs', 'data', 'result', 'req_0', 'req']) {
    if (k in value) { const list = songArray(value[k]); if (list.length) return list; }
  }
  return [];
}
export function findAudioUrl(value) {
  if (typeof value === 'string') return /^https?:\/\//.test(value) && !/\.(?:jpg|png)(?:\?|$)/.test(value) ? value : '';
  if (!value || typeof value !== 'object') return '';
  for (const k of ['url', 'playUrl', 'play_url', 'purl', 'data', 'playInfo']) {
    if (k in value) { const found = findAudioUrl(value[k]); if (found) return found; }
  }
  if (Array.isArray(value)) for (const x of value) { const found = findAudioUrl(x); if (found) return found; }
  return '';
}
export function isPublicMedia(value) {
  try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) && !u.username && !u.password && !u.port && ['music.126.net', 'music.163.com', 'qq.com', 'qqmusic.qq.com', 'kugou.com', 'kugoucdn.com', '365yg.com', 'douyinvod.com', 'douyinscdn.com', 'bytefcdn.com', 'bytecdn.cn', 'byteicdn.com', 'ibytedtos.com', 'zjcdn.com', 'pstatp.com', 'snssdk.com', 'bytedance.com', 'bytetos.com', 'volcvideo.com', 'volccdn.com', 'volces.com', 'volcengineapi.com', 'douyin.com', 'qishui.com', 'zijieapi.com'].some(host => u.hostname === host || u.hostname.endsWith('.' + host)); } catch { return false; }
}
