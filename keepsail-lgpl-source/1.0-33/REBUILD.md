# Keepsail media runtime corresponding source — 1.0 (33)

This package contains only library sources, build inputs, applied-source diffs,
configuration and licensing/relinking instructions. It contains no Keepsail app
source, user notes/media/URLs, verification records, signing key or app archive.

## Source identity and licence

FFmpegKit v6.0: d6be56d7aec286eb3c292d6b23ff07a6b70d8693.
Arthenica FFmpeg n6.0: ea3d24bbe3c58b171e55fe2151fc7ffaca3ab3d2.
GNU config v20210814: 805517123cbfe33d17c989a18e78c5789fab0437.
The original source copyrights/licence notices are retained. Runtime FFmpegKit
and FFmpeg are LGPL version 3 or later; GPL and nonfree components are disabled.
COPYING.GPLv3 is included because LGPLv3 incorporates that text. Host build tools
retain their own licences; they are not linked into or shipped in the iOS app.

## Rebuild

Use an arm64 Mac with Xcode 27.0 (27A266a), its iPhoneOS 27.0 SDK, the Xcode
command-line tools and Python 3.14+ (tarfile data filters). The app minimum iOS
version is 17.0. No system package installation is needed. This workflow builds
its GNU host tools into its own temporary work directory. It does not request or
read publisher signing keys. Source checkouts include minimal shallow Git
metadata so the upstream script can apply its normal checkout-based workarounds
without fetching sources. Reflogs and local identities are removed.

From this extracted package directory, choose a new path without spaces:

```sh
mkdir -p /tmp/keepsail-lgpl-rebuild
cp -R worktree/ffmpeg-kit /tmp/keepsail-lgpl-rebuild/ffmpeg-kit
KEEPSAIL_LGPL_WORK_DIR=/tmp/keepsail-lgpl-rebuild python3 scripts/build_lgpl_runtime.py
python3 scripts/verify_lgpl_runtime.py --source /tmp/keepsail-lgpl-rebuild/ffmpeg-kit
```

The build script uses the packaged host-tool archives and source checkouts. It
sets the explicit iOS arm64/no-bitcode configuration, enables AudioToolbox,
AVFoundation, VideoToolbox, zlib, bzip2 and iconv, and leaves GPL, nonfree and x264
disabled. Patches record the exact tracked source changes present after the
original build; normal upstream build scripts apply those workarounds themselves.
Do not blindly apply the same patch twice. The gas-preprocessor file already has
upstream's Perl 5.32+ brace fix. Host pkg-config's old bundled GLib is compiled
with a confined -Wno-int-conversion flag for current Clang compatibility.

Outputs are staged under output/lgpl-runtime/frameworks. The script does not
replace a production installation, code-sign, upload or submit anything. Build
dates, machine paths and compiler outputs can differ; byte-identical binaries
have not been promised. The original generated configuration is included for
comparison. GPL x264 software encoding is not offered by this release: the app
uses stream copy or system H.264 VideoToolbox plus AAC, and retains downloaded
sources when an unsupported conversion fails.

## Modifying/relinking the libraries

You may modify these library sources and rebuild all eight compatible dynamic
frameworks. Preserve their public Objective-C interfaces and install names such
as @rpath/ffmpegkit.framework/ffmpegkit. Use the complete matching framework set
when ABI-affecting changes are made. For a relinkable application bundle supplied
by the app distributor, replace the corresponding frameworks, retain the
@executable_path/Frameworks search path, and sign the resulting app and embedded
code with your own authorized Apple development/distribution identity and valid
entitlements. The publisher's private signing keys are neither needed nor given.

This source archive alone does not provide a relinkable Keepsail executable or
application object-code bundle and does not unlock an encrypted store download.
The distributor must separately provide the applicable relinking/installation
materials required by the LGPL terms. Public source hosting and delivery of
those materials remain separate release checks. No app term limits modification
of these LGPL libraries or reverse engineering needed to debug modifications.
