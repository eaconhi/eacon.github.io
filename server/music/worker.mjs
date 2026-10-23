import qqRequest from '@yakult-green-tea/qq-music-api/serverless';
import { Buffer } from 'node:buffer';
import { normalizeNetease, normalizeKugou, normalizeQq, songArray, findAudioUrl, isPublicMedia } from './providers.mjs';
import { QishuiSession, qishuiSessionToken, normalizeQishui } from './qishui.mjs';
export { QishuiSession };
globalThis.Buffer ||= Buffer;
const ORIGINS = new Set(['https://xpeng.win', 'https://eaconhi.github.io']);
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const fail = (message, status = 502) => Object.assign(new Error(message), { status });
const safeId = (provider, id) => provider === 'netease' ? /^\d{1,20}$/.test(id) : provider === 'kugou' ? /^[a-f\d]{32}$/i.test(id) : provider === 'qq' ? /^[\w-]{1,80}$/.test(id) : false;
async function remoteJson(url, init = {}) {
  const r = await fetch(url, { ...init, signal: AbortSignal.timeout(18000) });
  if (!r.ok) throw fail(`音乐平台暂时不可用（${r.status}），请稍后重试`);
  try { return await r.json(); } catch { throw fail('音乐平台返回了无法识别的数据，请稍后重试'); }
}
const netease = path => remoteJson('https://music.163.com/api/' + path, { headers: { Referer: 'https://music.163.com/', 'User-Agent': 'Mozilla/5.0' } });
async function qq(path, request, env) {
  const headers = new Headers();
  if (request.headers.has('X-QQ-Session')) headers.set('X-QQ-Session', request.headers.get('X-QQ-Session'));
  const r = await qqRequest(new Request('https://music-api.internal' + path, { headers }), { QQ_SESSION_SECRET: env.QQ_SESSION_SECRET });
  const data = await r.json();
  if (!r.ok || data.code && ![0, 200].includes(data.code)) throw fail(data.message || 'QQ 音乐暂不可用，请在账号页登录后重试', r.status === 401 ? 401 : 502);
  return data;
}
async function signedMedia(url, env, origin) {
  if (!isPublicMedia(url)) throw fail('平台未提供可用的音频地址；歌曲可能受账号或版权限制', 422);
  const payload = Buffer.from(JSON.stringify({ url, exp: Date.now() + 3600000 })).toString('base64url');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.MEDIA_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = Buffer.from(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))).toString('base64url');
  return `${origin}/v1/audio?token=${payload}.${signature}`;
}
async function audio(request, env) {
  const token = new URL(request.url).searchParams.get('token') || '';
  const [payload, signature] = token.split('.');
  if (!payload || !signature || token.length > 6000) return json({ error: '音频链接已失效，请重新选择歌曲' }, 403);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.MEDIA_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  if (!await crypto.subtle.verify('HMAC', key, Buffer.from(signature, 'base64url'), new TextEncoder().encode(payload))) return json({ error: '无效音频链接' }, 403);
  const claim = JSON.parse(Buffer.from(payload, 'base64url').toString());
  if (claim.exp < Date.now() || !isPublicMedia(claim.url)) return json({ error: '音频链接已过期，请重新选择歌曲' }, 403);
  const headers = new Headers({ Referer: new URL(claim.url).hostname.endsWith('126.net') ? 'https://music.163.com/' : 'https://y.qq.com/' });
  if (request.headers.has('Range')) headers.set('Range', request.headers.get('Range'));
  const response = await fetch(claim.url, { headers, redirect: 'follow', signal: AbortSignal.timeout(25000) });
  if (!response.ok) return json({ error: '平台未允许播放这首歌，请换一首或登录所属平台' }, response.status);
  const type = response.headers.get('Content-Type') || '';
  if (!/^(audio\/|video\/mp4|application\/octet-stream)/i.test(type)) return json({ error: '平台未返回音频内容' }, 422);
  const output = new Headers();
  for (const name of ['Content-Type', 'Content-Length', 'Content-Range', 'Accept-Ranges']) if (response.headers.has(name)) output.set(name, response.headers.get(name));
  output.set('Cache-Control', 'private, max-age=1800');
  return new Response(response.body, { status: response.status, headers: output });
}
async function route(request, env) {
  const u = new URL(request.url), p = u.searchParams;
  if (u.pathname === '/health') return json({ ok: true, version: '20261023-2', providers: ['netease', 'qq', 'kugou', 'qishui'], qqLogin: Boolean(env.QQ_SESSION_SECRET), qishuiLogin: Boolean(env.QISHUI_SESSIONS) });
  if (u.pathname === '/api/qishui') {
    if(request.method!=='POST')return json({error:'方法不支持'},405);
    if(Number(request.headers.get('Content-Length'))>10000)return json({error:'请求过大'},413);
    const session=await qishuiSessionToken(env.MEDIA_SECRET,request.headers.get('X-Qishui-Session'));
    if(!session)return json({error:'汽水音乐会话已过期，请重新连接'},401);
    const body=await request.json();
    const stub=env.QISHUI_SESSIONS.get(env.QISHUI_SESSIONS.idFromName(session.id));
    const r=await stub.fetch(new Request('https://qishui-session/request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}));
    const result=await r.json();
    if(result.ok&&body.operation==='search')result.data={songs:(result.data?.items||[]).map(normalizeQishui)};
    if(result.ok&&body.operation==='audio')result.data={...result.data,url:await signedMedia(result.data.url,env,u.origin)};
    if(!result.ok){const code=result.error?.code;result.error={code,message:code==='auth-required'?'请先在账号页扫码登录汽水音乐':code==='not-playable'?'汽水音乐未提供可播放的标准音质资源':code==='network'?'汽水音乐连接暂不可用，请稍后重试':'汽水音乐暂不可用，请稍后重试',upstreamCode:result.error?.upstreamCode,transport:result.error?.transport};}
    const response=json(result,result.ok?200:result.error?.code==='auth-required'?401:502);
    response.headers.set('X-Qishui-Session',session.token);return response;
  }
  if (u.pathname.startsWith('/api/qq/')) {
    const path = u.pathname.slice('/api/qq'.length);
    if (!/^\/(?:login\/(?:qr\/(?:key|create|check|cancel)|status|channels|refresh)|logout|user\/(?:detail|liked-songs|playlist))$/.test(path)) return json({ error: '此操作未开放' }, 404);
    return qqRequest(new Request(new URL(path + u.search, u.origin), request), { QQ_SESSION_SECRET: env.QQ_SESSION_SECRET });
  }
  if (u.pathname === '/v1/audio') return audio(request, env);
  if (request.method !== 'GET') return json({ error: '方法不支持' }, 405);
  const provider = p.get('provider'), id = p.get('id') || '';
  if (!['netease', 'qq', 'kugou'].includes(provider)) return json({ error: '请选择音乐平台' }, 400);
  if (u.pathname === '/v1/search') {
    const query = (p.get('q') || '').trim().slice(0, 100);
    if (!query) return json({ songs: [] });
    let songs;
    if (provider === 'netease') { const d = await netease(`search/get/web?s=${encodeURIComponent(query)}&type=1&limit=25`); if(d.code!==200)throw fail(`网易云暂未提供搜索结果（${d.code || '未知'}），请稍后重试`); songs = (d.result?.songs || []).map(normalizeNetease); }
    if (provider === 'kugou') { const d = await remoteJson(`https://songsearch.kugou.com/song_search_v2?keyword=${encodeURIComponent(query)}&page=1&pagesize=25&platform=WebFilter&format=json&iscorrection=1&privilege_filter=0`); if(d.status!==1)throw fail(`酷狗暂未提供搜索结果（${d.error_code || d.error || '未知'}），请稍后重试`); songs = (d.data?.lists || []).map(normalizeKugou); }
    if (provider === 'qq') songs = songArray(await qq(`/search?keyword=${encodeURIComponent(query)}&page=1&limit=25`, request, env)).map(normalizeQq);
    return json({ ok: true, songs: songs.filter(x => x.id && x.name) });
  }
  if (!safeId(provider, id)) return json({ error: '歌曲编号无效' }, 400);
  if (u.pathname === '/v1/play') {
    let url = '', detail = {};
    if (provider === 'netease') {
      const r = await fetch(`https://music.163.com/song/media/outer/url?id=${id}.mp3`, { redirect: 'manual', headers: { Referer: 'https://music.163.com/' } });
      url = r.headers.get('Location') || '';
      if (url.includes('404')) url = '';
      try { const d = await netease(`song/detail?ids=[${id}]`); if (d.songs?.[0]) detail = normalizeNetease(d.songs[0]); } catch {}
    }
    if (provider === 'qq') url = findAudioUrl(await qq(`/getMusicPlay/${id}?songmid=${id}&quality=128`, request, env));
    if (provider === 'kugou') { const d = await remoteJson(`https://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash=${id}`); url = d.url || d.play_url || ''; detail.cover = String(d.imgUrl || '').replace('{size}', '300'); }
    return json({ ok: true, url: await signedMedia(url, env, u.origin), detail });
  }
  if (u.pathname === '/v1/lyrics') {
    if (provider === 'netease') { const d = await netease(`song/lyric?id=${id}&lv=-1&tv=-1&kv=-1`); return json({ ok: true, lrc: d.lrc?.lyric || '', translation: d.tlyric?.lyric || '' }); }
    if (provider === 'qq') {
      const r = await fetch(`https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=${id}&format=json&nobase64=1`, { headers: { Referer: 'https://y.qq.com/' }, signal: AbortSignal.timeout(15000) });
      const text = await r.text(); const d = JSON.parse(text.replace(/^\w+\(/, '').replace(/\);?$/, ''));
      return json({ ok: true, lrc: d.lyric || '', translation: d.trans || '' });
    }
    const search = await remoteJson(`https://lyrics.kugou.com/search?ver=1&man=yes&client=pc&hash=${id}`);
    const item = search.candidates?.[0];
    if (!item) return json({ ok: true, lrc: '', translation: '' });
    const d = await remoteJson(`https://lyrics.kugou.com/download?ver=1&client=pc&id=${encodeURIComponent(item.id)}&accesskey=${encodeURIComponent(item.accesskey)}&fmt=lrc&charset=utf8`);
    return json({ ok: true, lrc: d.content ? Buffer.from(d.content, 'base64').toString('utf8') : '', translation: '' });
  }
  return json({ error: '接口不存在' }, 404);
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowed = origin && (ORIGINS.has(origin) || /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/.test(origin));
    if (origin && !allowed) return json({ error: '来源未授权' }, 403);
    let response;
    try { response = request.method === 'OPTIONS' ? new Response(null, { status: 204 }) : await route(request, env); }
    catch (error) { response = json({ ok: false, error: error.name === 'TimeoutError' ? '音乐平台响应超时，请重试' : error.message || '音乐服务暂不可用' }, error.status || 502); }
    response = new Response(response.body, response);
    if (allowed) response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Vary', 'Origin');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-QQ-Session, X-Qishui-Session, Range');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range, X-QQ-Session, X-Qishui-Session');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
  }
};
