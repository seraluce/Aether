# 资讯新闻主题 (News Theme)

基于 Astro 构建的 WordPress 风格资讯主题，三列布局，支持从 WordPress REST API 获取数据。

## 功能特性

- **三列布局**：左侧分类菜单、中间卡片式内容、右侧小组件
- **WordPress API**：完整 REST API 集成，支持文章/分类/标签/搜索
- **完整 SEO**：OG 标签、Twitter Card、JSON-LD 结构化数据
- **自动生成**：sitemap.xml、robots.txt
- **图片优化**：懒加载 + 扫光加载动画
- **响应式设计**：三列 → 双列 → 单列自适应
- **SSR/SSG**：支持静态模式和 Cloudflare Pages 部署
- **品牌素材**：AI 生成 Logo 和 Favicon

## 快速开始

```bash
npm install
npm run dev
```

## 配置 WordPress

```bash
cp .env.example .env
# 编辑 .env，设置 WP_SITE_URL
```

## 部署到 Cloudflare Pages

详见 [DEPLOY.md](./DEPLOY.md)

## 项目结构

```
src/
├── components/        # UI 组件
│   ├── PostGrid       # 文章卡片网格
│   ├── SidebarLeft    # 左侧分类菜单
│   └── SidebarRight   # 右侧小组件
├── data/              # 数据层
│   ├── fetcher        # API 数据获取
│   └── mock           # Mock 数据 fallback
├── layouts/           # 页面布局
├── lib/               # 工具库
│   ├── wordpress      # WP REST API 封装
│   └── mappers        # 数据映射
├── pages/             # 页面路由
└── styles/            # 全局样式
```

## 技术栈

- [Astro](https://astro.build/) - 静态站点框架
- [WordPress REST API](https://developer.wordpress.org/rest-api/) - 内容数据源
- [Cloudflare Pages](https://pages.cloudflare.com/) - 部署平台
