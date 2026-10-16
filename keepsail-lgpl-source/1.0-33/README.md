# Keepsail 1.0 (33) — FFmpegKit/FFmpeg 对应源码

这是媒体库源码与重建材料，不包含 Keepsail 应用源码、用户内容、签名密钥或应用安装包。运行库为 LGPL v3 或更新版本构建，禁用 GPL、nonfree 与 x264 组件。源码中的可选组件及编译工具各保留原许可。

请主动下载下列文件，放到同一个本地文件夹：

- `Keepsail-FFmpegKit-LGPL-source-1.0-33.tar.gz.part01`
- `Keepsail-FFmpegKit-LGPL-source-1.0-33.tar.gz.part02`
- `Keepsail-FFmpegKit-LGPL-source-1.0-33.tar.gz.part03`
- `SHA256SUMS.json`
- `reassemble.py`

然后在该文件夹中运行：

```sh
python3 reassemble.py
```

脚本只读取上述三个本地块，逐块校验并合并，再验证完整文件；不联网、不下载、不安装、不执行合并后的内容、不覆盖不同的已有文件。三个块为 20 MiB、20 MiB 和约 14.19 MiB。

完整文件为 `Keepsail-FFmpegKit-LGPL-source-1.0-33.tar.gz`，56,817,403 bytes，SHA256：

```text
9c018a2f6e8379b2c3bae434c9942909d839e2274a75633be24330cc91708fab
```

源码身份：FFmpegKit v6.0 `d6be56d7aec286eb3c292d6b23ff07a6b70d8693`；Arthenica FFmpeg n6.0 `ea3d24bbe3c58b171e55fe2151fc7ffaca3ab3d2`。解压后阅读 `REBUILD.md`，内含精确编译输入、实际变更和重链接说明。本包不包含可重链接的 Keepsail executable/object-code；此类材料及公开托管实际交付状态须由应用发行方另外核实。
