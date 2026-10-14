# Clean fullscreen clock and offline companion

Removed the treasure skills, notes and conversation cards from the DOM and removed their sheet handlers. Native fullscreen now presents only the original clock canvas and companion; settings, scene tabs, date text, sensor overlays and launchers are hidden. Entering fullscreen temporarily shows the clock scene, and exiting restores the saved scene without changing storage.

The prior worker cached wallpapers/videos only. The new versioned application cache precaches 71 static resources (10.21 MiB), including the complete module graph and both companion atlases, and is installed proactively on the desktop entry. It excludes telemetry APIs and private uploads. Existing media caches are preserved. All renderer module diffs are version changes only.

Validation: 13 browser checks passed with actual native fullscreen, desktop/portrait views, scene restoration, persistent texture caching, cleared ordinary browser cache, offline reload and renewed companion rendering. Production build, lint and types passed. An initial online visit must complete the cache installation; a new browser with no downloaded app cannot open a website offline. Native web resources were synchronized; no phone app installation or physical vehicle validation was performed.
