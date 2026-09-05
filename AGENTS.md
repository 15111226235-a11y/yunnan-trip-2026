# AGENTS.md

## 项目概览

这是一个纯静态的「云南 8 天 7 晚旅行手册」网页，托管在 Cloudflare Workers，`main` 分支推送后自动发布。

## 目录结构

- `yunnan-trip-site/` — Cloudflare Worker / 静态站点项目根目录（`wrangler.jsonc` 所在位置）
  - `public/index.html` — **真正被部署的唯一页面**，所有内容、样式与脚本都在此单文件内
  - `index.html` — `public/index.html` 的完全一致副本，当前未参与部署
  - `README.md` — 部署与页面说明
  - `package.json` — 仅含 wrangler 脚本

## 常用命令

所有命令都在 `yunnan-trip-site/` 目录下执行：

- 本地预览：`npm run dev`（或 `npx wrangler dev`）
- 手动部署：`npm run deploy`（或 `npx wrangler deploy`）
- 正式发布：推送 `main` 分支到 GitHub，Cloudflare 会自动构建部署

## 硬性约束

- 保持单文件零依赖：不要引入外部 CSS / JS / 图片或地图 SDK。
- 不要偷偷加入任何 API Key；高德仅使用 `uri.amap.com` 链接。
- 所有时间使用带 `+08:00` 的 ISO 时间，并按 `Asia/Shanghai` 处理时区与昼夜切换。
- 页面正文为简体中文，注意语义与行程事实保持一致。

## 编辑指南

- 修改页面内容时优先编辑 `public/index.html`。
- 若同时改动 `yunnan-trip-site/index.html`，必须保持两份文件完全一致，避免漂移。
- 倒计时事件定义在页面底部 `events` 数组中；新增/调整行程时同步更新。
- 待办清单通过 `data-todo` 与 `localStorage` 保存状态；不要随意改名或删除 id，否则用户已勾选状态会丢失。
- 路线、地点、酒店、交通等事实性信息要谨慎核对；存在不确定性时保留「待确认 / 需核实」措辞。

## UI/UX 设计工作流

涉及界面设计或改版时，按固定顺序使用技能：

1. `frontend-design` — 先确定整体视觉方向与风格基调。
2. `ui-ux-pro-max` — 再根据方向产出具体设计方案与实现细节。

不要跳过方向定义直接进入具体实现。

## 工作流

- 使用小步提交，提交信息用中文简要说明改动内容。
- 推送前可先跑本地预览确认布局与脚本行为。
- 不要提交 `node_modules`、临时文件或本地配置。
