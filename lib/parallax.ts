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
  const travel = ramp(p, 0.14, 0.42);
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
      '--portrait-x': `${-travel * 56}%`,
      '--portrait-y': `${-p * 5}vh`,
      '--portrait-scale': String(1 + travel * 0.08 - outro * 0.19),
      '--portrait-rotate': `${-3 + travel * 6 - outro * 3}deg`,
      '--portrait-opacity': String(1 - outro * 0.86),
      '--story-opacity': String(storyOpacity),
      '--story-y': `${(1 - ramp(p, 0.32, 0.47)) * 48 - outro * 55}px`,
      '--roles-opacity': String(rolesOpacity),
      '--roles-y': `${(1 - rolesOpacity) * 42}px`,
      '--word-x': `${-p * 12}%`,
      '--word-y': `${p * 10}vh`,
      '--line-y': `${-p * 22}vh`,
      '--mobile-portrait-x': `${-travel * 10}%`,
    },
  };
}
