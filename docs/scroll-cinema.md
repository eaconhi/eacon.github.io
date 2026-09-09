# Personal-site parallax

The user clarified that the intended first-screen interaction is mouse-follow parallax, then requested the first parallax edition's background. The active hero now uses the background from commit `003a5c0`: charcoal `#111110`, a large faint `EACON JING.` word, and two thin orange diagonal rules. The rendered workspace is no longer mounted or downloaded by the page.

## Pointer depth

On `(hover: hover) and (pointer: fine)`, coordinates are normalized against the visible stage and clamped to [-1, 1]. One animation frame updates two CSS variables without re-rendering React.

- The original portrait moves by up to 24 × 18 px, tilts by up to 14 degrees horizontally and 9 degrees vertically.
- The name moves in the opposite direction, by up to 16 × 12 px.
- The large background word moves by up to 8 × 6 px; diagonal rules move by up to 12 × 7 px. Workflow panels have their own displacement.
- The inner portrait owns pointer transforms; the outer layer owns scroll transforms. Pointer easing does not delay scroll progress.
- Navigation and action buttons remain stationary. Leaving the stage or losing focus returns the layers to center.
- Touch devices retain natural page scrolling. No touch capture, gesture interception, orientation permission or sensor access is used.
- Reduced motion disables both effects and displays the original portrait and chapters in normal document flow.

## Scroll narrative

Every normal viewport uses one sticky 100svh stage. Narrow widths change composition, not interaction. Mobile uses a 540svh section; desktop uses 580svh. Measured stage height determines absolute scroll progress, without wheel interception or timers.

1. The portrait grows to at most 1.18 times its starting scale while the name moves separately.
2. Four working-process steps enter with different translations and perspective angles.
3. The portrait returns beside the concise career direction.

Full introduction and career targets remain in the normal About section. The supplied portrait JPG is unchanged and appears on both opening and closing frames and in reduced-motion mode.

## Verification

All 14 tests pass, including exact reversible scroll frames, stable plateaus and safe CSS values, plus tests for the retained but inactive ScrollCinema component. Next static export and TypeScript checks pass with the existing GitHub Pages base path.

Actual 319 × 760 preview: pinned chapters, no horizontal overflow, a prominent original portrait and two fitting action labels. Mouse left/right changes the portrait's translation/rotation and moves the name in the opposite direction while scrollY remains zero. The restored background is rgb(17,17,16), the faint name and orange rules are present, and the page contains zero video elements.

Also visually inspected 390 × 667 and 1280 × 800 during development. These are browser viewport checks, not actual iPhone/Safari hardware verification.

The workspace video, poster, render script and ScrollCinema component are retained as inactive source assets from the previous edition; they are not referenced by the active Hero.

## Full-screen layout correction

Desktop uses left-aligned introduction and career text in the left 44% column, with the portrait centered at 74% of the stage shell. Photo width is bounded by viewport width, height and a 25rem maximum; short windows use a smaller height cap. Name scaling is capped at 1.05 and portrait scaling at 1.18. The closing portrait returns to the same right column instead of colliding with the final heading. Mobile retains its vertical composition. Navigation uses a compact menu below 1280px so medium desktop widths do not squeeze every link into the header.

Checked 1728 × 1117, 1280 × 800 and 1024 × 560. The full-screen opening had 198px between the text column and portrait at rest; 1280px kept a 133px gap with the pointer at the left edge. At 1024 × 560 the final English chapter retained a 167px gap, and all portrait/text content ended above the action bar. A regression test now bounds foreground growth and ensures the closing portrait remains visible and returns to its original column.
