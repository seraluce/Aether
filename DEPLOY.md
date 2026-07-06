# Cloudflare Pages 部署指南

## 运行模式

本项目使用 **SSR（服务端渲染）模式**，每次访问实时从 WordPress API 获取数据，无需重新构建即可显示新发布的文章。

## 快速部署

### 方式一：通过 Cloudflare Dashboard（推荐）

1. 将代码推送到 GitHub/GitLab
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 Workers & Pages > Create > Pages
4. 连接 Git 仓库
5. 配置构建设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `18` 或更高
6. 保存并部署

### 方式二：通过 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 构建项目
npm run build

# 部署到 Cloudflare Pages
npm run deploy
```

## 环境变量配置

在 Cloudflare Dashboard 的 Pages 项目设置中添加：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `WP_SITE_URL` | WordPress 站点地址 | `https://your-wp-site.com` |
| `SITE_URL` | 你的站点地址 | `https://news.example.com` |

## 自定义域名

1. 在 Pages 项目设置 > Custom domains
2. 添加你的域名
3. 按提示配置 DNS 记录

## 注意事项

- SSR 模式每次访问实时获取 WordPress 数据，新文章即时显示
- 内置内存缓存，相同请求在缓存有效期内不会重复请求 WordPress API
- 图片建议使用 CDN 或 WordPress 媒体库
- 如无法连接 WordPress API，会自动使用 mock 数据

## 本地预览

```bash
npm run build
npm run preview
```

访问 http://localhost:4321 查看效果
