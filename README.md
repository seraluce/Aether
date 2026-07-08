# Aether — 资讯新闻主题

基于 **Astro 7** + **Cloudflare Pages** 构建的 WordPress 风格资讯站点，三栏布局，支持从 WordPress REST API 获取数据，SSR 模式实时渲染。

## 功能特性

- **三栏布局**：左侧分类菜单、中间卡片式内容、右侧热门/标签小组件
- **WordPress REST API**：完整集成，支持文章/分类/标签/搜索，自动降级到 Mock 数据
- **文章详情页**：代码高亮（highlight.js）、行号、复制按钮、图片懒加载、二维码分享
- **分类/标签页**：自动预渲染所有分类和标签页面
- **搜索功能**：实时搜索文章，关键词高亮
- **文章归档**：按月分组，时间线展示
- **站点地图 & SEO**：自动生成 sitemap.xml、robots.txt、OG/Twitter Card/JSON-LD 结构化数据
- **主题切换**：浅色/深色/跟随系统，Header 按钮 + 移动端菜单切换
- **响应式设计**：三列 → 双列 → 单列自适应
- **图片优化**：懒加载 + 骨架屏 shimmer 动画
- **无限滚动**：首页文章列表分批加载 + 交叉观察者
- **内存缓存**：WordPress API 请求缓存（默认 5 分钟）
- **静态预渲染**：首页、分类页、标签页、文章详情页、关于/归档/404 均支持静态生成

## 快速开始

```bash
# 安装依赖
npm install

# 配置 WordPress 站点
cp .env.example .env
# 编辑 .env，设置 WP_SITE_URL=https://your-wordpress-site.com

# 启动开发服务器（默认 http://0.0.0.0:4300）
npm run dev
```

## 项目结构

```
src/
├── components/            # UI 组件
│   ├── ArticleActions.astro   # 文章操作栏（点赞/分享/二维码）
│   ├── ArticleSidebar.astro   # 文章侧边栏（相关推荐/评论区）
│   ├── PostGrid.astro         # 文章卡片网格（含无限滚动）
│   ├── SidebarLeft.astro      # 左侧分类导航
│   └── SidebarRight.astro     # 右侧小组件（热门/标签/版权）
├── data/                 # 数据层
│   ├── fetcher.ts            # WordPress 数据获取 + 缓存
│   └── mock.ts               # Mock 数据 fallback
├── icons/                # 社交图标 SVG
├── layouts/
│   └── Layout.astro          # 全局布局（SEO/Header/主题切换）
├── lib/                  # 工具库
│   ├── wordpress.ts          # WordPress REST API 封装
│   └── mappers.ts            # WP 数据 → 前端模型映射
├── pages/                # 页面路由
│   ├── index.astro           # 首页
│   ├── article/[id].astro    # 文章详情（静态预渲染）
│   ├── topic/[id].astro    # 分类页面
│   ├── tag/[id].astro      # 标签页面
│   ├── search.astro          # 搜索
│   ├── archive.astro         # 文章归档
│   ├── categories.astro      # 全部分类
│   ├── tags.astro            # 全部标签
│   ├── about.astro           # 关于页面
│   ├── 404.astro             # 404 页面
│   ├── robots.txt.ts         # robots.txt
│   ├── sitemap.xml.ts        # 站点地图
│   └── api/posts.json.js     # 分页 API（用于无限滚动）
├── config.ts             # WordPress 配置
├── site.config.ts        # 站点配置（导航/社交/主题等）
├── styles/
│   └── global.css            # 全局样式（主题变量/布局/响应式）
└── env.d.ts              # 环境变量类型声明
```

## 技术栈

| 技术 | 用途 |
|------|------|
| [Astro 7](https://astro.build/) | 静态站点框架 + SSR |
| [@astrojs/cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) | Cloudflare Pages 适配器 |
| [WordPress REST API](https://developer.wordpress.org/rest-api/) | 内容数据源 |
| [highlight.js](https://highlightjs.org/) | 代码语法高亮 |
| [Cloudflare Pages](https://pages.cloudflare.com/) | 部署平台 + 边缘渲染 |

## 环境变量

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `WP_SITE_URL` | WordPress 站点地址 | 是 |

## 部署

详见 [DEPLOY.md](./DEPLOY.md)。

### 本地构建预览

```bash
npm run build
npm run preview
```

## 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（端口 4300） |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 本地预览构建产物 |
| `npm run deploy` | 部署到 Cloudflare Pages |
