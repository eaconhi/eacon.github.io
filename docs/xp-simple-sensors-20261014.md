# Compact altitude and direction settings

The sensor settings panel previously mixed native iPhone pairing, server URL editing, browser sender/receiver pairing and browser diagnostics. The normal desktop now shows altitude and direction with a single initial pairing form; after pairing, it hides that form and retains automatic restoration through the existing saved receiver credentials.

The reference is the user's 2026-10-11 vehicle screenshot (24 m, north 350 degrees). `sensor-core.js` matches commit `0c1b88c`; the current Swift collector matches the preserved original collector. Fixed HTTPS entry and the original LAN reader remain supported. No phone collector or relay backend was changed.

Validation: 14 browser checks at 390x844 and 1440x900, including refresh, pause/resume, stale data, disconnect and native LAN source, using isolated sample fixtures; 16 existing sensor/relay checks; Next production build and type/lint checks passed. Browser fixture checks do not verify the current physical iPhone or vehicle. Native web resources were synchronized, but no native app installation was performed.
