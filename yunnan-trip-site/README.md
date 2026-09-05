# 云南 8天7晚旅行手册

## 同行人共享待办（Cloudflare Workers + D1）

前端仍为单文件、无外部依赖；`worker.mjs` 提供公开共享待办接口。所有访客打开页面即可读取和修改同一份清单，无需登录或同步码。首次部署只需配置 D1；当前仓库已绑定线上数据库，正常更新无需重新创建。

在本目录执行：

1. `npx wrangler login` 登录拥有现有 Worker 的 Cloudflare 账号。
2. `npx wrangler d1 create yunnan-trip-todos` 创建数据库，把返回的绑定加入 `wrangler.jsonc` 顶层（保留已有字段）：

   ```json
   "d1_databases": [{
     "binding": "DB",
     "database_name": "yunnan-trip-todos",
     "database_id": "替换为实际数据库 UUID"
   }]
   ```

3. `npx wrangler d1 execute yunnan-trip-todos --remote --file=schema.sql` 初始化表（不会清空已有记录）。
4. 提交数据库绑定配置并推送 `main`，由现有 Cloudflare 构建发布；也可执行 `npx wrangler deploy`。

页面自动读取云端进度，不会把旧的本机清单整体上传。每次只上传变更项，页面可见时每 15 秒同步，切回页面、恢复网络时也同步。未上传修改保存在本机并重试；同一条待办以服务器最后接受的新操作为准，包括晚到的离线操作。重复请求不会再次修改状态。

旧版浏览器缓存中的同步码会在打开新版页面后移除，待上传修改会保留。接口不再使用 `SYNC_CODE` Secret。请保留 D1 绑定配置，避免后续部署丢失绑定。

本地调试时执行上述初始化命令但将 `--remote` 换为 `--local`，再运行 `npx wrangler dev`。

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
