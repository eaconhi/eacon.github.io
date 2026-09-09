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
  const approach = ramp(p, 0, 0.23);
  const expand = ramp(p, 0.23, 0.43);
  const settle = ramp(p, 0.7, 0.88);
  const introOpacity = 1 - ramp(p, 0.08, 0.23);
  const storyOpacity = ramp(p, 0.35, 0.46) * (1 - ramp(p, 0.64, 0.75));
  const rolesOpacity = ramp(p, 0.78, 0.9);
  return {
    chapter: p < 0.3 ? 0 : p < 0.78 ? 1 : 2,
    styles: {
      '--scene-progress': String(p),
      '--intro-opacity': String(introOpacity),
      '--intro-y': `${-approach * 110}px`,
      '--intro-scale': String(1 + approach * 0.6),
      '--portrait-opacity': String(1 - expand + settle),
      '--portrait-x': `${-expand * 31 + settle * 14}vw`,
      '--portrait-y': `${-approach * 5 + expand * 2 + settle * 4}svh`,
      '--portrait-scale': String(1 + approach * 0.65 - expand * 1.12 + settle * 0.26),
      '--portrait-rotate': `${-10 + approach * 10 - expand * 22 + settle * 22}deg`,
      '--word-x': `${-p * 12}%`,
      '--word-y': `${p * 10}svh`,
      '--line-y': `${-p * 22}svh`,
      '--story-opacity': String(storyOpacity),
      '--story-y': `${(1 - ramp(p, 0.32, 0.46)) * 90 - ramp(p, 0.64, 0.75) * 90}px`,
      '--story-scale': String(1.15 - ramp(p, 0.32, 0.46) * 0.15),
      '--methods-opacity': String(ramp(p, 0.32, 0.48) * (1 - ramp(p, 0.64, 0.77))),
      ...Object.fromEntries([0, 1, 2, 3].flatMap(i => {
        const enter = ramp(p, 0.28 + i * 0.025, 0.46 + i * 0.025);
        const exit = ramp(p, 0.62 + i * 0.02, 0.76 + i * 0.02);
        const side = i % 2 ? 1 : -1;
        return [
          [`--method-${i + 1}-x`, `${side * ((1 - enter) * (180 + i * 45) + exit * 170)}px`],
          [`--method-${i + 1}-y`, `${(1 - enter) * (100 - i * 50) - exit * 140}px`],
          [`--method-${i + 1}-rotate`, `${side * (1 - enter) * 35}deg`],
          [`--method-${i + 1}-scale`, String(0.65 + enter * 0.35 - exit * 0.2)],
        ];
      })),
      '--roles-opacity': String(rolesOpacity),
      '--roles-y': `${(1 - rolesOpacity) * 42}px`,
    },
  };
}
