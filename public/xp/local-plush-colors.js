const EXTRA_COLORS = {
  snow: ['云朵白', '#eeeae3'], sky: ['晴空蓝', '#87b9dc'],
  honey: ['蜂蜜金', '#e5bd69'], coral: ['蜜橘橙', '#ef9876'],
  cherry: ['樱桃红', '#c8616b'], wine: ['莓果酒', '#945667'],
  ocean: ['深海蓝', '#527998'], teal: ['青玉色', '#67a7a0'],
  cocoa: ['可可棕', '#96725e'], slate: ['雾岩灰', '#90979f'],
  lemon: ['柠檬黄', '#e6d48a'], ink: ['墨夜黑', '#464955'],
  klein: ['克莱因蓝', '#002fa7']
};

export function normalizeClockColor(value) {
  const hex = String(value || '').trim();
  if (/^#[0-9a-f]{6}$/i.test(hex)) return hex.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(hex)) return '#' + [...hex.slice(1)].map(c => c + c).join('').toLowerCase();
  return null;
}
const channels = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const toHex = rgb => '#' + rgb.map(c => Math.round(c).toString(16).padStart(2, '0')).join('');
const mix = (hex, target, amount) => toHex(channels(hex).map((c, i) => c * (1 - amount) + channels(target)[i] * amount));

export function customClockPalette(value, name = '自选颜色') {
  const color = normalizeClockColor(value) || '#dfa88a';
  return { name, color, highlight: mix(color, '#fff8ee', .72),
    dot: mix(color, '#bfcfe3', .76), accent: mix(color, '#4a3d46', .28) };
}
export function createClockPalette(original, customColor) {
  const palettes = { ...original };
  for (const [key, [name, color]] of Object.entries(EXTRA_COLORS)) palettes[key] = customClockPalette(color, name);
  palettes.custom = customClockPalette(customColor);
  return palettes;
}

function rgbToHsv(hex) {
  const [r, g, b] = channels(hex).map(c => c / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let hue = delta === 0 ? 0 : max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return { h: (hue * 60 + 360) % 360, s: max === 0 ? 0 : delta / max, v: max };
}
function hsvToHex({ h, s, v }) {
  const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
  const rgb = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return toHex(rgb.map(n => (n + m) * 255));
}

export function mountClockColorPicker({ root, palettes, value, selected, register, onPalette, onColor }) {
  const swatches = root.querySelector('.dock-palette .swatches');
  if (!swatches) return null;
  const style = document.createElement('style');
  style.textContent = `
    .dock-palette{min-width:0!important;display:grid!important;grid-template-columns:78px minmax(0,1fr)!important;gap:8px!important;height:auto!important;min-height:61px!important}
    .dock-palette .dock-label{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:1px!important;min-width:0!important}
    .dock-palette .swatches{display:grid!important;grid-template-columns:repeat(4,minmax(18px,30px)) minmax(54px,1fr)!important;gap:5px!important;min-width:0!important;width:100%!important;align-items:center!important}
    .dock-palette .swatch{width:100%!important;max-width:30px!important;height:auto!important;min-height:0!important;aspect-ratio:1!important;border:3px solid white!important;border-radius:50%!important;background:var(--swatch)!important;box-sizing:border-box!important;cursor:pointer}
    .dock-palette .swatch.active{box-shadow:0 0 0 2px var(--accent)}
    .dock-palette #palette-name{display:block!important;margin-top:3px;font:600 10px/1.3 system-ui!important;white-space:nowrap;color:var(--accent)}
    .clock-color-open{display:inline-flex;align-items:center;justify-content:center;gap:4px!important;padding:5px!important;min-width:0!important;min-height:0!important;width:100%!important;height:32px!important;box-sizing:border-box!important;border:1px solid #b7aab54d;border-radius:20px;background:#ffffff70;color:#655a69;font:600 11px/1.5 system-ui!important;white-space:nowrap;cursor:pointer}
    .clock-color-icon{width:16px;height:16px;flex:0 0 16px;box-sizing:border-box;border:2px solid white;border-radius:50%;background:conic-gradient(#ed8b91,#e9c978,#91bf9b,#83bbda,#b393cf,#ed8b91);box-shadow:0 1px 4px #77617b25}
    .clock-color-backdrop{position:fixed;inset:0;z-index:220;display:grid;place-items:center;background:#34304026;backdrop-filter:blur(5px);padding:16px;box-sizing:border-box}
    .clock-color-backdrop[hidden]{display:none!important}
    .clock-color-dialog{width:min(550px,100%);max-height:calc(100dvh - 32px);overflow:auto;box-sizing:border-box;padding:23px;border:1px solid #ffffffb0;border-radius:28px;background:#fcf9fcf5;box-shadow:0 20px 90px #493b652d;color:#655a69;font:14px/1.5 system-ui;text-align:left}
    .clock-color-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:17px}
    .clock-color-header h2{margin:0;font-size:21px;letter-spacing:1px;color:#514757}
    .clock-color-header p{margin:4px 0 0;color:#a091a2;font-size:12px}
    .clock-color-close{border:0;background:#efe8f0;color:#786a7e;width:36px;height:36px;border-radius:50%;font:24px system-ui;cursor:pointer}
    .clock-color-custom{display:grid;grid-template-columns:220px 1fr;gap:27px;align-items:center}
    .clock-color-wheel-wrap{width:220px;height:220px;position:relative;border-radius:50%;box-shadow:0 4px 16px #8b6b9015}
    .clock-color-wheel{width:100%;height:100%;border-radius:50%;touch-action:none;cursor:crosshair;display:block}
    .clock-color-marker{position:absolute;width:14px;height:14px;box-sizing:border-box;border:3px solid white;box-shadow:0 0 0 1px #62536870,0 2px 6px #0005;border-radius:50%;transform:translate(-50%,-50%);pointer-events:none}
    .clock-color-chip{height:64px;border-radius:17px;border:1px solid #a996b226;box-shadow:inset 0 1px 5px #ffffff50;margin-bottom:16px}
    .clock-color-field{display:block;margin-top:12px;font-size:12px;color:#8a7c8e}
    .clock-color-field input[type=text]{display:block;box-sizing:border-box;width:100%;margin-top:5px;border:1px solid #d7cbd9;border-radius:11px;padding:9px 12px;background:#fff;color:#655a69;font:15px ui-monospace,monospace;letter-spacing:1px;outline-offset:3px}
    .clock-color-field input[aria-invalid=true]{border-color:#bd6076}
    .clock-color-field input[type=range]{width:100%;height:24px;margin:5px 0 0;accent-color:#ac8baa;cursor:pointer}
    .clock-color-hint{min-height:18px;margin:4px 0 0;font-size:11px;color:#b15f76}
    .clock-color-presets{display:grid;grid-template-columns:repeat(9,1fr);gap:12px 7px;margin:19px 0 0;padding-top:17px;border-top:1px solid #ded2e244}
    .clock-color-preset{border:0;background:transparent;padding:2px;cursor:pointer;color:#938298;font:10px/1.5 system-ui;display:flex;align-items:center;flex-direction:column;gap:5px;white-space:nowrap}
    .clock-color-preset span{display:block;width:32px;height:32px;box-sizing:border-box;border:3px solid white;border-radius:50%;box-shadow:0 0 0 1px #c6b5cc50;background:var(--choice)}
    .clock-color-preset[aria-pressed=true] span{box-shadow:0 0 0 2px #a58bab}
    .clock-color-footer{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-top:19px;color:#a091a2;font-size:12px}
    .clock-color-done{border:0;background:#b59bb8;color:white;padding:10px 26px;border-radius:16px;font:600 14px system-ui;cursor:pointer}
    @media(max-height:540px) and (min-width:560px){.clock-color-dialog{width:530px;padding:16px 22px}.clock-color-header{margin-bottom:10px}.clock-color-custom{grid-template-columns:170px 1fr;gap:30px}.clock-color-wheel-wrap{width:170px;height:170px}.clock-color-chip{height:36px;margin-bottom:7px}.clock-color-presets{margin-top:12px;padding-top:10px;gap:7px}.clock-color-footer{margin-top:12px}}
    @media(max-width:559px){.clock-color-dialog{padding:18px}.clock-color-custom{grid-template-columns:minmax(140px,1.15fr) minmax(105px,1fr);gap:16px}.clock-color-wheel-wrap{width:100%;height:auto;aspect-ratio:1}.clock-color-presets{grid-template-columns:repeat(4,1fr)}.clock-color-preset{font-size:11px}.dock-palette{grid-template-columns:68px minmax(0,1fr)!important;gap:5px!important}.dock-palette .swatches{gap:4px!important;grid-template-columns:repeat(4,minmax(18px,26px)) minmax(50px,1fr)!important}}
  `;
  root.append(style);
  const paletteName = swatches.querySelector('#palette-name');
  const paletteLabel = root.querySelector('.dock-palette .dock-label');
  if (paletteName && paletteLabel) paletteLabel.append(paletteName);
  const opener = document.createElement('button');
  opener.className = 'clock-color-open'; opener.type = 'button';
  opener.innerHTML = '<span class="clock-color-icon" aria-hidden="true"></span>色盘';
  opener.setAttribute('aria-haspopup', 'dialog'); opener.setAttribute('aria-expanded', 'false');
  swatches.append(opener);
  const backdrop = document.createElement('div'); backdrop.className = 'clock-color-backdrop'; backdrop.hidden = true;
  backdrop.innerHTML = `
    <section class="clock-color-dialog" role="dialog" aria-modal="true" aria-label="绒毛配色色盘">
      <header class="clock-color-header"><div><h2>绒毛配色</h2><p>挑一种今天喜欢的颜色</p></div><button class="clock-color-close" type="button" aria-label="关闭色盘">×</button></header>
      <div class="clock-color-custom">
        <div class="clock-color-wheel-wrap"><canvas class="clock-color-wheel" width="220" height="220" role="slider" tabindex="0" aria-label="颜色色盘" aria-valuemin="0" aria-valuemax="360"></canvas><span class="clock-color-marker"></span></div>
        <div><div class="clock-color-chip" aria-hidden="true"></div><label class="clock-color-field">明暗<input type="range" min="0" max="100" step="1" aria-label="颜色明暗"></label><label class="clock-color-field">颜色代码<input type="text" maxlength="7" spellcheck="false" aria-label="颜色代码" placeholder="#DFA88A"></label><p class="clock-color-hint" aria-live="polite"></p></div>
      </div>
      <div class="clock-color-presets" aria-label="推荐配色"></div>
      <footer class="clock-color-footer"><span>随心选色，自动记住</span><button class="clock-color-done" type="button">完成</button></footer>
    </section>`;
  root.append(backdrop);
  const find = selector => backdrop.querySelector(selector);
  const wheel = find('.clock-color-wheel'), marker = find('.clock-color-marker'), chip = find('.clock-color-chip');
  const brightness = find('input[type=range]'), hexInput = find('input[type=text]'), hint = find('.clock-color-hint');
  let current = normalizeClockColor(value) || '#dfa88a', hsv = rgbToHsv(palettes[selected]?.color || current), active = selected, dragging = null;
  const context = wheel.getContext('2d');
  if (context) {
    const image = context.createImageData(220, 220);
    for (let y = 0; y < 220; y++) for (let x = 0; x < 220; x++) {
      const dx = (x + .5 - 110) / 110, dy = (y + .5 - 110) / 110, s = Math.hypot(dx, dy);
      if (s > 1) continue;
      const color = channels(hsvToHex({ h: (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360, s, v: 1 }));
      const offset = (y * 220 + x) * 4;
      image.data.set([...color, Math.round(Math.min(1, (1 - s) * 110) * 255)], offset);
    }
    context.putImageData(image, 0, 0);
  }
  const draw = () => {
    const hex = hsvToHex(hsv), angle = hsv.h * Math.PI / 180;
    marker.style.left = `${50 + Math.cos(angle) * hsv.s * 48}%`; marker.style.top = `${50 + Math.sin(angle) * hsv.s * 48}%`;
    marker.style.background = hex; chip.style.background = `linear-gradient(135deg,${mix(hex, '#ffffff', .2)},${hex})`;
    wheel.style.filter = `brightness(${hsv.v})`;
    wheel.setAttribute('aria-valuenow', String(Math.round(hsv.h))); wheel.setAttribute('aria-valuetext', hex);
    brightness.value = String(Math.round(hsv.v * 100)); hexInput.value = hex.toUpperCase();
    hexInput.setAttribute('aria-invalid', 'false'); hint.textContent = '';
    backdrop.dataset.selectedPalette = active;
    for (const button of backdrop.querySelectorAll('[data-color-choice]')) button.setAttribute('aria-pressed', String(button.dataset.colorChoice === active));
  };
  const apply = () => { current = hsvToHex(hsv); active = 'custom'; draw(); onColor(current); };
  for (const [key, palette] of Object.entries(palettes)) {
    if (key === 'custom') continue;
    const button = document.createElement('button'); button.className = 'clock-color-preset'; button.type = 'button'; button.dataset.colorChoice = key;
    button.style.setProperty('--choice', `linear-gradient(135deg,${palette.highlight},${palette.color})`);
    button.innerHTML = `<span aria-hidden="true"></span>${palette.name}`;
    button.setAttribute('aria-label', `选择${palette.name}`); button.setAttribute('aria-pressed', 'false');
    find('.clock-color-presets').append(button);
    register(button, 'click', () => { active = key; hsv = rgbToHsv(palette.color); draw(); onPalette(key); });
  }
  const open = state => {
    backdrop.hidden = !state; opener.setAttribute('aria-expanded', String(state));
    if (state) { draw(); find('.clock-color-close').focus(); } else opener.focus();
  };
  register(opener, 'click', () => open(true));
  register(find('.clock-color-close'), 'click', () => open(false));
  register(find('.clock-color-done'), 'click', () => open(false));
  register(backdrop, 'click', event => { if (event.target === backdrop) open(false); });
  register(window, 'keydown', event => {
    if (backdrop.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); open(false); }
    if (event.key === 'Tab') {
      const focusable = [...backdrop.querySelectorAll('button,input,[tabindex="0"]')];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }, true);
  const pick = event => {
    const bounds = wheel.getBoundingClientRect(), dx = (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2), dy = (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2);
    hsv.h = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360; hsv.s = Math.min(1, Math.hypot(dx, dy)); apply();
  };
  register(wheel, 'pointerdown', event => { if (event.button !== 0) return; event.preventDefault(); dragging = event.pointerId; wheel.setPointerCapture(dragging); pick(event); });
  register(wheel, 'pointermove', event => { if (event.pointerId === dragging) pick(event); });
  register(wheel, 'pointerup', () => { dragging = null; });
  register(wheel, 'pointercancel', () => { dragging = null; });
  register(wheel, 'keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') hsv.h = (hsv.h + 357) % 360;
    if (event.key === 'ArrowRight') hsv.h = (hsv.h + 3) % 360;
    if (event.key === 'ArrowUp') hsv.s = Math.min(1, hsv.s + .03);
    if (event.key === 'ArrowDown') hsv.s = Math.max(0, hsv.s - .03);
    apply();
  });
  register(brightness, 'input', () => { hsv.v = Number(brightness.value) / 100; apply(); });
  register(hexInput, 'input', () => {
    const entered = hexInput.value.startsWith('#') ? hexInput.value : '#' + hexInput.value;
    const color = /^#[0-9a-f]{6}$/i.test(entered) ? normalizeClockColor(entered) : null;
    if (!color) { hexInput.setAttribute('aria-invalid', 'true'); hint.textContent = '输入六位颜色代码，如 #DFA88A'; return; }
    hsv = rgbToHsv(color); apply();
  });
  draw();
  return { sync(key, customColor) {
    active = key; current = normalizeClockColor(customColor) || current;
    hsv = rgbToHsv(key === 'custom' ? current : palettes[key]?.color || current);
    draw();
  } };
}
