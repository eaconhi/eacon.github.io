import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLyrics, lyricIndex, preferences, LAYOUTS, LYRIC_STYLES, formatTime } from '../../../features/music/core.mjs';
import { normalizeNetease, normalizeQq, normalizeKugou, songArray, isPublicMedia } from '../providers.mjs';
import { qishuiSessionToken, normalizeQishui } from '../qishui.mjs';
test('lyrics preserve multi timestamps, translations and a seek across a long instrumental gap', () => {
  const lines = parseLyrics('[00:01.00][00:40.50]甲\n[00:10.00]乙', '[00:01.00]A\n[00:10.00]B');
  assert.deepEqual(lines.map(x => x.start), [1, 10, 40.5]);
  assert.equal(lines[0].translation, 'A');
  assert.equal(lyricIndex(lines, 0), -1);
  assert.equal(lyricIndex(lines, 39), 1);
  assert.equal(lyricIndex(lines, 41), 2);
  assert.equal(lyricIndex(lines, 3), 0);
});
test('word timing, empty lyrics and invalid oversized imports', () => {
  assert.deepEqual(parseLyrics('[00:01.00]<00:01.00>你<00:02.00>好')[0].words, [{ start: 1, text: '你' }, { start: 2, text: '好' }]);
  assert.deepEqual(parseLyrics(''), []);
  assert.equal(parseLyrics('[00:01.00]&#20320;&#22909;&#10;')[0].text,'你好');
  assert.throws(() => parseLyrics('a'.repeat(3 * 1024 * 1024)), /过大/);
});
test('old or corrupted preferences cannot hide controls or make text unreadable', () => {
  const pref = preferences({ layout: 'obsolete', lyricStyle: 'x', opacity: -10, lyricOpacity: 0, lyricSize: 999, volume: Infinity, enabled: 'false' });
  assert.equal(pref.layout, 'bar'); assert.equal(pref.lyricStyle, 'center');
  assert.equal(pref.opacity, 40); assert.equal(pref.lyricOpacity, 40); assert.equal(pref.lyricSize, 72); assert.equal(pref.enabled, true);
  assert.equal(LAYOUTS.length, 8); assert.equal(LYRIC_STYLES.length, 4); assert.equal(formatTime(65.9), '1:05');
});
test('QQ search uses the actual serverless items envelope and preserves song MID', () => {
  const data = { code: 200, data: { type: 'song', items: [{ mid: '003abc', title: '曲名', singer: [{ name: '歌手' }], album: { name: '专辑', mid: '001def' } }] } };
  assert.equal(songArray(data).length, 1);
  assert.equal(normalizeQq(songArray(data)[0]).id, '003abc');
  assert.equal(normalizeQq(songArray(data)[0]).artist, '歌手');
  assert.equal(normalizeNetease({ id: 1, name: '曲', ar: [{ name: '人' }], dt: 180000 }).duration, 180);
  assert.equal(normalizeKugou({ FileHash: 'ABCD', SongName: '<em>曲</em>' }).name, '曲');
});
test('audio relay cannot be turned into a public arbitrary URL or local-network proxy', () => {
  for (const url of ['http://127.0.0.1/', 'https://localhost/', 'https://music.126.net.evil.test/a', 'https://user:pass@music.126.net/a', 'https://music.126.net:8443/a', 'file:///etc/passwd']) assert.equal(isPublicMedia(url), false, url);
  assert.equal(isPublicMedia('https://m8.music.126.net/abc.mp3'), true);
  assert.equal(isPublicMedia('https://dl.stream.qqmusic.qq.com/a.m4a'), true);
});
test('Qishui KRC words retain line and word offsets',()=>{
  const rows=parseLyrics('[1000,3000]<0,1000,0>测<1000,1000,0>试\n[5000,1000]<0,1000,0>尾');
  assert.equal(rows[0].text,'测试');assert.deepEqual(rows[0].words.map(x=>x.start),[1,2]);assert.equal(lyricIndex(rows,4),0);
});
test('Qishui browser tokens are opaque session references and cannot be forged',async()=>{
  const session=await qishuiSessionToken('test-secret-not-for-production');
  assert.equal((await qishuiSessionToken('test-secret-not-for-production',session.token)).id,session.id);
  assert.equal(await qishuiSessionToken('another-secret',session.token),null);
  assert.equal(await qishuiSessionToken('test-secret-not-for-production','forged.ticket'),null);
  const track=normalizeQishui({base_info:{id:'12345678901234567890',name:'测试',duration_ms:2000},related_info:{artist_links:[{name:'作者'}]}});
  assert.equal(track.id,'12345678901234567890');assert.equal(track.artist,'作者');
});
