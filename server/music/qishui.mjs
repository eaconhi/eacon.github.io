import { createQishuiApi, createQishuiDeviceId } from 'qishui-music-api';
const ALLOWED = new Set(['search', 'song_detail', 'audio', 'lyrics', 'login_status', 'login_qr_key', 'login_qr_create', 'login_qr_check', 'login_qr_cancel', 'logout', 'liked_songs', 'recent_played']);
// One opaque browser session maps to one private server object. Account tickets never leave this object.
export class QishuiSession {
  constructor(ctx) {
    this.ctx = ctx; this.pending = [];
    ctx.blockConcurrencyWhile(async () => {
      const saved = await ctx.storage.get(['deviceId', 'account']);
      const deviceId = saved.get('deviceId') || createQishuiDeviceId();
      if (!saved.get('deviceId')) await ctx.storage.put('deviceId', deviceId);
      let account = saved.get('account') || null, revision = 0;
      const pending = this.pending;
      const sessions = { deviceId, get revision() { return revision; }, get: () => account,
        set(value) { account = value; revision++; pending.push(ctx.storage.put('account', value)); },
        clear() { account = null; revision++; pending.push(ctx.storage.delete('account')); } };
      this.api = createQishuiApi({ deviceId, sessions, fetch: async(url, options = {}) => {
        // Workers have no browser cookie jar; the browser-only credentials option is unsupported here.
        try {const r=await fetch(url,{...options,redirect:options.redirect==='error'?'manual':options.redirect,signal:AbortSignal.timeout(20000)});
          if(options.redirect==='error'&&r.status>=300&&r.status<400)throw new Error('UPSTREAM_REDIRECT_REFUSED');
          if(!r.ok)this.transport={host:new URL(url).hostname,status:r.status};return r;}
        catch(e){this.transport={host:new URL(url).hostname,code:e.cause?.code||(/redirect/i.test(e.message)?'REDIRECT_DENIED':e.name)};throw e;}
      }, log() {}, warn() {} });
    });
  }
  async fetch(request) {
    const { operation, params = {} } = await request.json();
    if (!ALLOWED.has(operation)) return Response.json({ ok: false, error: { code: 'unsupported', message: '此操作未开放' } }, { status: 400 });
    this.transport=null;
    const result = await this.api.request(operation, params);
    if(!result.ok&&this.transport)result.error.transport=this.transport;
    await Promise.all(this.pending.splice(0));
    await this.ctx.storage.setAlarm(Date.now() + 30 * 86400000);
    return Response.json(result);
  }
  async alarm() { await this.ctx.storage.deleteAll(); }
}
async function tokenKey(secret, usage) { return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [usage]); }
export async function qishuiSessionToken(secret, token) {
  if (token) {
    try {
      const [body, signature] = token.split('.');
      if (!body || !signature || token.length > 500) return null;
      const [id, expiry] = atob(body).split(':');
      if (!/^[a-f\d-]{36}$/.test(id) || Number(expiry) < Date.now()) return null;
      const valid = await crypto.subtle.verify('HMAC', await tokenKey(secret, 'verify'), Uint8Array.from(atob(signature), x => x.charCodeAt(0)), new TextEncoder().encode('qishui:' + body));
      return valid ? { id, token } : null;
    } catch { return null; }
  }
  const id = crypto.randomUUID(), body = btoa(`${id}:${Date.now() + 7 * 86400000}`);
  const signature = await crypto.subtle.sign('HMAC', await tokenKey(secret, 'sign'), new TextEncoder().encode('qishui:' + body));
  return { id, token: body + '.' + btoa(String.fromCharCode(...new Uint8Array(signature))) };
}
export function normalizeQishui(x) {
  const base = x.base_info || {}, related = x.related_info || {};
  const artists = related.artist_links || base.song_maker_team?.composers || [];
  let cover = x.display_info?.cover_url;
  if (cover && typeof cover === 'object') { const url = cover.urls?.find(x => typeof x === 'string' && x.startsWith('https://')) || ''; cover = cover.uri && url.endsWith('/') ? url + cover.uri + (cover.template_prefix ? '~' + cover.template_prefix + '-image.image' : '') : url; }
  return { provider: 'qishui', id: String(base.id || x.id || ''), name: String(base.name || ''), artist: artists.map(x => x.name || '').filter(Boolean).join(' / '),
    album: related.album_link?.name || '', cover: typeof cover === 'string' && cover.startsWith('https://') ? cover : '', duration: (Number(base.duration_ms) || 0) / 1000 };
}
