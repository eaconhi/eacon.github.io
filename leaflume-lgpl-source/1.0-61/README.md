# Leaflume 1.0 (61) — library source mapping

This directory maps Leaflume Build 61 to the **unchanged media library materials 1.0-33**. Build 61's eight archived dynamic frameworks have the same arm64 file-backed sections and LC_UUID as the source build referenced by that material. Code signatures differ between app builds/exports and are recorded separately. No library source archive was regenerated just to change the app's brand/build number.

- Library corresponding source, exact build inputs, existing patches and full license text: [fixed 1.0-33 source directory](https://github.com/eaconhi/eacon.github.io/tree/69c98b6ba4e418f61e85750b5621e8097a1c4bdf/keepsail-lgpl-source/1.0-33).
- Source archive: `Keepsail-FFmpegKit-LGPL-source-1.0-33.tar.gz`, 56,817,403 bytes, SHA256 `9c018a2f6e8379b2c3bae434c9942909d839e2274a75633be24330cc91708fab`.
- `SOURCE-MAPPING.json` records Build 61 correspondence. `REBUILD.md` explains how to use the existing source materials. `RELINKING.md` records the proposed dynamic-library mechanism and its unverified boundaries.
- `licenses/` and `LICENSE-FONT-MANIFEST.json` reproduce actual Build 61 bundled LGPL/GPL-reference/OFL notices and font identities. Upstream copyrights and conditions remain in effect.

This package contains no complete application source, App executable/IPA, user collection, private signing key, provisioning profile or credential. It does not claim App Review approval or a legal compliance determination. Existing source directory naming is a material version, not an old application-binary claim.
