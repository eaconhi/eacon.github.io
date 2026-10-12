const SETTINGS = 'plush-clock-settings-v3';
const MIGRATION = 'xp-plush-fidelity-v1';

// Preserve all style and pose choices while adopting the reference fine profile once.
export function upgradePlushClockQuality(storage = localStorage) {
  try {
    if (storage.getItem(MIGRATION)) return;
    const saved = JSON.parse(storage.getItem(SETTINGS) || 'null');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      storage.setItem(SETTINGS, JSON.stringify({ ...saved, quality: 'high' }));
    }
    storage.setItem(MIGRATION, '1');
  } catch { /* Restricted storage leaves the original fine defaults intact. */ }
}

export function plushClockPixelRatio(quality, devicePixelRatio = 1) {
  const key = ['low', 'medium', 'high'].includes(quality) ? quality : 'high';
  const ratio = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1;
  const floor = { low: 1, medium: 1.35, high: 2 }[key];
  const cap = { low: 1.15, medium: 1.65, high: 2 }[key];
  return Math.min(Math.max(ratio, floor), cap);
}
