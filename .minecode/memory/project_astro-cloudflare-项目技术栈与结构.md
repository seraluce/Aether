---
type: project
title: "Astro + Cloudflare 项目技术栈与结构"
description: "Astro + Cloudflare 项目，WordPress 数据源，含文章/标签/主题页面，使用 TypeScript"
createdAt: 2026-07-08T05:09:00.354Z
updatedAt: 2026-07-08T05:09:00.356Z
---

## 技术栈
- Astro + Cloudflare 部署
- WordPress 作为数据源（通过 `src/lib/wordpress.ts`）
- TypeScript 严格类型检查（`astro check`）
- highlight.js 通过 CDN 外部加载（非 inline script，需用 `window.hljs` 引用）

## 项目结构
- `src/lib/wordpress.ts` — WordPress 数据获取
- `src/lib/mappers.ts` — 数据映射（导入 wordpress 用 `./wordpress` 相对路径）
- `src/layouts/Layout.astro` — 布局组件，必填属性：`favicon`/`icon`/`logo`
- `src/site.config.ts` — 站点配置（`siteConfig`）
- `src/components/LodeMore.astro` — 加载更多组件（注意 `getElementById` 返回 null 需处理）
- `src/components/SidebarLeft.astro` — 左侧边栏
- `src/styles/global.css` — 全局样式

## 页面路由
- `article/[id].astro` — 文章详情页（使用 `getPosts`）
- `tag/[name].astro` — 标签页
- `topic/[slug].astro` — 主题页
- `404.astro` — 404 页面

## 已知问题与修复记录
- `article/[id].astro` 曾缺少 `getPosts` 导入，`hljs` 未声明（改为 `window.hljs`）
- `404.astro`、`tag/[name].astro`、`topic/[slug].astro` 的 `<Layout>` 曾缺少必填属性
- `LodeMore.astro` 的 `getElementById` 返回值未处理 null 类型
- 曾发现一个异常文件（文件名是多个路径用空格拼接），内容是 `mappers.ts` 旧版本（仍用 `../lib/wordpress`），已被删除
