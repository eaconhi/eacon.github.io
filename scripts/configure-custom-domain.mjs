import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const domain = process.env.GITHUB_PAGES_CUSTOM_DOMAIN?.trim();
if (!domain) process.exit(0);
if (!/^[a-z0-9.-]+$/i.test(domain)) throw new Error("Invalid custom domain");

const output = resolve("out");
await mkdir(resolve(output, "profile"), { recursive: true });
await copyFile(resolve(output, "index.html"), resolve(output, "profile/index.html"));
await writeFile(resolve(output, "CNAME"), `${domain}\n`);
await writeFile(resolve(output, "index.html"), `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#101318">
  <meta http-equiv="refresh" content="0;url=./xp/">
  <link rel="canonical" href="https://${domain}/xp/">
  <link rel="icon" href="./xp/branding/xiaop-logo-512.png">
  <title>小 P桌面</title>
  <script>location.replace(new URL('./xp/' + location.search + location.hash, location.href));</script>
  <style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#101318;color:#f1f5f9;font:20px system-ui}a{color:inherit}</style>
</head>
<body><a href="./xp/">进入小 P桌面</a></body>
</html>
`);
console.log(`Custom domain ${domain}: / opens Xiao P desktop; portfolio preserved at /profile/`);
