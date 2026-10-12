# Xiao P plush display release

The companion now peeks behind digits, enters and leaves through a continuous timeline, and receives food on its hat and face. Authored plush head variants keep both hats fitted to the head; independently animated eyes remain visible on turns. Pet settings remain independent of the clock.

This release refines the head texture, uses supported anisotropic sampling, restores the fine quality profile once for existing users, and keeps the high-quality clock canvas at 2x. Idle colon balls retain their original geometry and fur density while rotation, breathing and wind animation are disabled to prevent shimmering. Touch responses and scene transitions remain active.

## Validation

- Original controller freshly fetched from `https://xp.leung.xin/assets/plush-clock-controller-rIQ2KnEj.js`; SHA-256 matches the bundled original.
- Original numeral geometry and shader text unchanged. Both controlled renders contain 246154 fibers at high quality.
- Same-host, same-time, same-style screenshot crop: mean channel delta 0.0715/255; 0.0938% of pixels exceed an 8-level channel delta. This establishes the compared clock crop, not full-site or companion-model equivalence.
- Idle colon temporal mean channel delta: 14.534 before, 0.319 after with the other clock motion enabled.
- Nine module/quality/trajectory checks passed; 1440x900, 1920x1080, 390x844 browser flows passed, including props, food, settings independence, notes, sensor overlay and disposal/reopen.
- Production Next.js build, lint and type checks passed. Cache epochs are synchronized across the full clock import graph.

## Limits

The plush companion uses articulated artwork layers in the original Three.js scene, rather than the original manufacturer's native model. Head atlas dimensions are 2172x724, not a claimed 4K asset. Native phone resources are prepared but this web deployment does not install the phone app. Actual XOS hardware performance remains unverified.
