import test from 'node:test';
import assert from 'node:assert/strict';
import {heroFrame, clamp} from '../lib/parallax.ts';

test('out of range and non-finite inputs produce safe endpoint frames', () => {
  assert.deepEqual(heroFrame(-3), heroFrame(0));
  assert.deepEqual(heroFrame(4), heroFrame(1));
  for (const value of [NaN, Infinity, -Infinity]) assert.deepEqual(heroFrame(value), heroFrame(0));
  assert.equal(clamp(0.5), 0.5);
});
test('stop and reverse produce the exact same complete frame', () => {
  const first = heroFrame(0.46);
  for (const p of [0.8, 1, 0.7, 0.2, 0.46]) heroFrame(p);
  assert.deepEqual(heroFrame(0.46), first);
});
test('three readable plateaus expose the appropriate chapter', () => {
  for (const [p, chapter, key] of [[0, 0, '--intro-opacity'], [0.52, 1, '--story-opacity'], [1, 2, '--roles-opacity']]) {
    const frame = heroFrame(p);
    assert.equal(frame.chapter, chapter);
    assert.equal(Number(frame.styles[key]), 1);
  }
});
test('continuous sampling contains no invalid CSS values or opacity overshoot', () => {
  for (let i = 0; i <= 1000; i++) {
    const {styles} = heroFrame(i / 1000);
    for (const [key, value] of Object.entries(styles)) {
      assert.ok(Number.isFinite(parseFloat(value)), `${key}: ${value}`);
      if (key.endsWith('-opacity')) assert.ok(Number(value) >= 0 && Number(value) <= 1);
    }
  }
});
