# Wallpaper presentation controls

`public/xp/display-state.js` is the shared state detector for the sensor and music overlays. Gallery browsing, even in browser fullscreen, keeps the data card, player and lyrics hidden. Image/video presentation and the plush screensaver show them. Native fullscreen moves overlays into its painted subtree; the app's fullscreen fallback works too. Pairing and audio playback remain independent of visibility.

`style.css` keeps the sensor glass compact with opaque text, reserves opposite corners for data and the persistent 44 px exit, and keeps the music host visible inside the plush presentation. Existing wallpaper cover/contain choices remain with the viewer.

Run `npm run build:music` to build display and music assets, or `npm run build` for the full site. The build fingerprints the shared detector, sensor module, styles and entry module so an older cached sensor module does not override the new visibility rules. Offline resources are updated together. Edit the canonical files, not the generated hash files.

Run `npm run test:display` for the gallery/fallback/native state cases. Browser QA additionally covers restored pairing with synthetic readings, gallery to image to gallery, plush entry/exit, mobile safe edges and coexistence with the music player. These checks do not establish a real phone or XOS sensor connection.
