# 云南 8天7晚旅行手册

网页主体只有 `public/index.html`，无 CSS/JS/图片外部依赖；高德按钮仅在点击后跳转到高德 URI。

## 本地预览（电脑）
需要 Node.js。进入项目目录后：
`npx wrangler dev`

## Cloudflare Workers + GitHub 自动发布（电脑）
1. 把整个项目上传到 GitHub 仓库。
2. 登录 Cloudflare → Workers & Pages → Create application → Get started → Import a repository。
3. 选择 GitHub 仓库。
4. Root directory 保持项目根目录。
5. Build command 留空。
6. Deploy command 填 `npx wrangler deploy`。
7. Production branch 选 `main`。
8. Save and Deploy。
之后 push 到 `main` 会自动部署。

注意：Cloudflare Workers Builds 要求 Cloudflare Worker 名称与 `wrangler.jsonc` 的 `name` 一致。

## 页面说明
- 倒计时目标时间使用带 `+08:00` 的 ISO 时间；不会因为打开手机处在其他时区而发生目标时间偏移。
- 日/夜配色按 `Asia/Shanghai` 自动切换。
- 每日路线图使用内嵌 SVG；不依赖外部图片或地图 SDK。
- 高德 URI 路线按钮使用起点/终点，必要时加入 1 个途经点。高德 URI API 当前对该方式有明确支持；更复杂的多途经点需要高德 Web Service API，因此本静态零依赖版本不偷偷引入 API Key。
