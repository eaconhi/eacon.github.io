/** Absolute scroll progress: no timers, inertia or previous-frame state. */
export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}

export function ramp(value: number, from: number, to: number) {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
}

export function heroFrame(value: number) {
  const p = clamp(value);
  const outro = ramp(p, 0.68, 0.92);
  const introOpacity = 1 - ramp(p, 0.12, 0.29);
  const storyOpacity = ramp(p, 0.32, 0.47) * (1 - ramp(p, 0.66, 0.79));
  const rolesOpacity = ramp(p, 0.78, 0.9);
  return {
    chapter: p < 0.3 ? 0 : p < 0.78 ? 1 : 2,
    styles: {
      '--scene-progress': String(p),
      '--intro-opacity': String(introOpacity),
      '--intro-y': `${-ramp(p, 0, 0.36) * 90}px`,
      '--story-opacity': String(storyOpacity),
      '--story-y': `${(1 - ramp(p, 0.32, 0.47)) * 48 - outro * 55}px`,
      '--roles-opacity': String(rolesOpacity),
      '--roles-y': `${(1 - rolesOpacity) * 42}px`,
    },
  };
}
