# Continuous workspace camera

The requested reference binds scrolling to a continuous video timeline. The earlier portrait transforms did not reproduce that interaction. This revision replaces the hero background with an original rendered 3D workspace camera move.

## Implementation and acceptance

- [x] Paused inline video, controlled only by absolute scroll progress.
- [x] Coalesce rapid seeks; retain the latest position before metadata loads.
- [x] Preserve resume content, Chinese/English switching and existing links.
- [x] Poster on media failure or reduced motion; compact windows retain the moving background behind naturally flowing content.
- [x] Inspect original scene at the start, middle and end.
- [x] Encode H.264/yuv420p without audio and with frequent keyframes.
- [x] Verify forward, stationary and reverse scroll in the browser.
- [x] Inspect desktop and mobile layouts, plus reduced-motion fallback.
- [x] Build static export with the existing GitHub Pages base path.

## Asset provenance

`scripts/render-workspace.py` builds the scene from original geometry and materials. No downloaded footage, third-party models, logos or photographed people are embedded in the movie. The original supplied portrait remains a large foreground image, including in compact and reduced-motion layouts.

## Interaction

`Hero` measures scroll progress over its sticky region. `ScrollCinema` maps that progress to the MP4 duration; it never starts playback. When seeking is still running, intermediate targets are discarded and the latest scroll position wins. Text chapters share the same absolute progress.

The implementation does not intercept wheel or touch scrolling. Resume sections and anchor navigation remain standard document content.

## Regenerating the media

Tested with Blender 4.5.9 LTS. Preview with 48 samples; the smooth, fixed-lighting movie uses 16 samples and 168 frames at 24 fps (7 seconds).

```sh
blender --background --python scripts/render-workspace.py -- \
  --output-dir /tmp/workspace-frames --frames 168 \
  --width 1280 --height 720 --samples 16

ffmpeg -framerate 24 -i /tmp/workspace-frames/frame-%04d.png \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 1 -keyint_min 1 -sc_threshold 0 -movflags +faststart -an \
  public/workspace-dolly.mp4
```

Each encoded frame is independently decodable to keep reverse scroll responsive. Rendered frames and the `.blend` scene are build inputs, not website downloads.

## Verified result — 2026-09-09

- 13 tests passed; Next production export and TypeScript checks passed.
- Final MP4: 1280 × 720, 24 fps, 168 frames, exactly 7 seconds, 4,699,027 bytes; H.264/yuv420p, no audio. Complete decode passed. `moov` precedes `mdat`.
- SHA-256: `f5023712b34fbaa5f29d8a4fb0b075ecb963839e77750ca5e31b6b5d315e8d51`.
- Desktop 1280 × 800: 50% scroll = 3.4995 seconds; it stayed fixed without scrolling; the end reached 6.999 seconds. Video stayed paused.
- Mobile layout 390 × 844: 50% = 3.4995 seconds; reverse to 25% = 1.74975 seconds. No horizontal overflow; middle-chapter content ended before the buttons.
- English 375 × 812: last-chapter content ended at y568; buttons began at y718. No overlap.
- Reduced motion: all chapters appeared in document flow; video source was absent. Actual iPhone/Safari hardware was not available for this check.
- Python SimpleHTTP's missing byte-range support was reproduced as seekable [0,0]. Use `scripts/serve-preview.py` for local static preview. Its 206 response was verified against the exact requested bytes. Unsupported seeking falls back to the poster.
- Rendered edit source and three high-quality preview frames are retained outside the repository at `../outputs/workspace-camera/`.

## Compact-window correction

The user's actual in-app viewport was 319 × 760. The previous width threshold disabled video entirely and hid the small identity thumbnail, so the shipped experience failed in that window even though wider QA passed.

Motion preference and layout are now independent. Only `prefers-reduced-motion: reduce` disables media. Width, height and dense English content select a flowing foreground over a sticky 100svh video. Progress uses the section height minus the visible viewport, not the full flowing stage height. The original portrait is restored as a prominent figure in both layouts.

Verified in the actual 319 × 760 window: portrait 264 × 352 at y373–725, no horizontal overflow, video loaded and ready. Scrolling 600px kept the backdrop at y0, moved the portrait to y−227, and advanced the camera to 3.394225 seconds. English scrolling 300px advanced to 1.598477 seconds; stopping preserved it; reversing to 150px returned to 0.799238 seconds.

Also checked 390 × 667 in both languages and 1024 × 560 landscape: video remained enabled; the background stayed at y0 as content moved. Desktop 1280 × 800 restored a 443 × 488 portrait. Reduced motion removed the video source but kept the large portrait visible.
