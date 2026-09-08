# Parallax delivery verification

Date: 2026-09-09 (Asia/Shanghai)
Base: GitHub main cb3625a8ffa7f55c1fd57ae284d1d6b57ac4c563
Branch: feat/resume-parallax
Local preview: http://127.0.0.1:3100/
Publication: pending user authorization; no push or public deployment performed.

## Implementation

- Three scroll-controlled chapters: identity/portrait, delivery narrative, target roles.
- Portrait, type, accents and chapter transitions use absolute scroll position. Native scroll and direct links are retained.
- Existing portrait and current AI operations content; no reference video was copied or generated.
- Continuous ribbons now follow scrolling; the experience timeline and ribbons use one pending animation frame.
- Reduced motion, short viewports and compact English phones use normal document flow. All chapter text remains accessible.

## Passed checks

- Production build with GITHUB_PAGES=true and GITHUB_REPOSITORY=eaconhi/eacon.github.io: static export, TypeScript and built-in lint passed. Page first-load JS 116 kB.
- All 11 referenced local base-path assets exist in out/.
- Four progress-model tests pass: clamping/non-finite input, repeatability after reverse, three chapter plateaus, 1001 finite samples and bounded opacity.
- Browser at 1280x800: sticky stage stays at y=0 at scrollY=780; scene progress 0.44318. Final portrait right edge 581px, story starts 630px.
- Two separated reads at fixed scroll position returned identical transforms and progress.
- Browser at 390x844: Chinese page has no horizontal overflow; portrait top 467px follows subtitle bottom 451px, portrait bottom 723px remains above actions at 769px.
- English language switch works. At 375x667 the hero switches to normal flow, all three chapter opacities are 1, and no Chinese text appears in the page body.
- Emulated reduced motion: normal-flow stage, all chapters visible. Emulation cleared after checking.
- Project link reaches #projects and the existing native case disclosure opens and closes successfully.
- Temporary viewport overrides reset. Chinese preview restored and retained for user review.

## Unchanged / verification boundary

Git diff confirms profile-data.ts, private-access.tsx, portrait, both resume PDFs and package-lock.json are unchanged. The external Tally form was not submitted. No new dependency was added. This verifies local rendering and the static export; it is not evidence of a public deployment.

## Continue or publish

Use this checkout as the current work, not the older Documents backup. The origin is the existing https://github.com/eaconhi/eacon.github.io.git repository. The preview uses the retained development process on port 3100. Before publishing, get the user's public-publishing authorization, fetch origin and verify main has not changed from the recorded base; then integrate and publish through the existing GitHub Pages workflow. Do not migrate hosting or modify profile data as part of publication.
