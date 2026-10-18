# Build 49 corresponding-library rebuild materials

The media runtime did not change from material version 1.0-33. Download all three source parts, checksum files and `reassemble.py` from the fixed directory linked in README. Verify/reassemble locally, extract the library-only archive, and follow its `REBUILD.md`. The archive retains original source copyrights, patches, build helpers and host-tool input archives.

The existing materials identify FFmpegKit v6.0 `d6be56d7aec286eb3c292d6b23ff07a6b70d8693` and Arthenica FFmpeg n6.0 `ea3d24bbe3c58b171e55fe2151fc7ffaca3ab3d2`. The configured runtime disables GPL, nonfree and x264; bundled GPLv3 is the text incorporated by LGPLv3, not a claim that the entire application is GPL.

Rebuild on an arm64 Mac using Xcode 27/iPhoneOS SDK and the packaged host-tool workflow, targeting iOS 17 arm64. Preserve matching Objective-C interfaces, install names and all eight compatible dynamic frameworks. See the source material's exact build/configuration notes. Bit-identical rebuilds are not promised; Build 49 mapping compares actual section bytes and UUID against the fixed source-build artifacts.

Nothing in this document downloads an App binary, grants Apple signing rights, installs software or bypasses platform controls.
