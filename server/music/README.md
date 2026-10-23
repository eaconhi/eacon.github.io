# 小 P HTTPS 音乐服务

Cloudflare Worker `xp-music-api`，自定义域名 `music.xpeng.win`。独立部署，不修改 `relay.xpeng.win` 或其传感器会话。

```sh
npm ci
npx wrangler secret bulk
npx wrangler deploy
```

部署需要两个随机高强度 secret：`MEDIA_SECRET`（签发限时音频地址与汽水对象引用）与 `QQ_SESSION_SECRET`（QQ 平台会话）。使用 Wrangler secret 存储，不写入版本库或日志。现有生产 secret 已配置；日常部署无需重新创建或轮换。

`QISHUI_SESSIONS` 绑定使用 SQLite Durable Object，公开 API 只发出不透明且有时限的浏览器引用；设备标识、账号票据及私钥留在服务端对象，闲置30天后清理。扫码由用户主动发起。平台读取请求不自动执行收藏、歌单修改或其他写入动作。

接口：`/health`、`/v1/search`、`/v1/play`、`/v1/lyrics`、`/v1/audio`、`/api/qq/*`、`POST /api/qishui`。音频中转仅接受服务端签发的限时地址，限制平台媒体域名、验证响应类型并转发 Range。没有通用的任意 URL 代理。

CORS 仅开放用户站点与本机开发地址。第三方库许可见 `THIRD_PARTY_NOTICES.md`；源码与版本固定在 `package-lock.json`。不记录账号原始响应、二维码内容、票据、音频签名 URL 或完整会话。
