# Keepsail LGPL library modification and relinking information

This public folder provides exact corresponding FFmpegKit/FFmpeg library sources, build inputs and instructions. It does not include the Keepsail application source, app executable/object-code, an installation package, user data, signing keys, or provisioning profiles. It does not unlock an encrypted App Store download. Source availability and application relinking/installation material delivery are separate requirements.

## Rebuild and compatible replacement

1. Download the three source parts, `SHA256SUMS.json`, and `reassemble.py`; run `python3 reassemble.py` locally. The script only checks and joins local files; it has no network or installation operation. Verify the complete archive hash against `PUBLIC-MANIFEST.json`, then extract it and read `REBUILD.md`.
2. Use the packaged official source revisions and build inputs. You may modify these LGPL libraries. Rebuild the complete matching set: `ffmpegkit`, `libavcodec`, `libavdevice`, `libavfilter`, `libavformat`, `libavutil`, `libswresample`, `libswscale`. The published build targets iOS arm64, minimum iOS 17.0, and disables GPL, nonfree, and x264.
3. Preserve the public Objective-C API/ABI and install names `@rpath/<name>.framework/<name>`. An ABI change may need matching application material and is not promised to work with an unchanged executable.
4. For an unencrypted relinkable application bundle separately supplied by its distributor, replace the matching files in its Frameworks directory and retain the `@executable_path/Frameworks` search path. Use your own authorized Apple signing identity, valid bundle IDs/capabilities, and appropriate App/Share/Widget provisioning profiles. Sign modified frameworks first, extensions second, and the main app last, then perform strict signature verification and test on your own device. No publisher signing key is required or supplied.
5. Apple Sign in, iCloud, and App Groups have team-specific entitlements and service identifiers. A different team cannot be promised access to the publisher's services. Additional application code/configuration may be necessary for such changes.

## What has and has not been provided

The public source archive contains the exact library source inputs, applied diffs, configuration and licence texts. This public site does not distribute a relinkable application executable or object-code bundle. A modified-framework re-sign/install/run test has not been completed. These documents alone do not assert that all LGPL Corresponding Application Code, installation information, relinking and distribution obligations have been fulfilled for every distribution channel.

No Keepsail term restricts modification of the LGPL-covered library portions or reverse engineering needed to debug those modifications. Contact `hieacon@gmail.com` to ask about application/relinking material delivery.
