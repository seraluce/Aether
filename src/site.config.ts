// ============================================================
// 站点配置文件 — 所有站点设置集中在这里修改

// ============================================================
const siteUrl = import.meta.env.WP_SITE_URL;

export const siteConfig = {
  // 站点基本信息
  site: {
    name: "峰瑞博客网",
    shortName: "BLOG",
    slogan: "最新最全的新闻资讯平台",
    description:
      "最新最全的新闻资讯平台，涵盖科技、财经、体育、娱乐、国际等多个领域",
    url: "https://www.kovel.com",
    type: "website",
    language: "zh-CN",
    timezone: "Asia/Shanghai",
    logo: {
      dark: "/logo-dark.svg",
      light: "/logo.svg"
    },

    favicon: "/images/logo.png",
  },

  // SEO & 社交分享
  seo: {
    keywords: "新闻,资讯,科技,财经,体育,娱乐,国际",
    ogImage: "/images/og-image.png",
    twitterHandle: "",
  },

  // 备案信息
  legal: {
    icp: "闽ICP备2021011984号",
    icpLink: "https://beian.miit.gov.cn/",
  },

  // 顶部导航菜单
  headerNav: [
    { name: "首页", href: "/", active: true },
    { name: "科技", href: "/topic/tech" },
    { name: "财经", href: "/topic/finance" },
    { name: "体育", href: "/topic/sports" },
    { name: "娱乐", href: "/topic/entertainment" },
    { name: "国际", href: "/topic/world" },
  ],

  // 页脚链接
  footerLinks: [
    { name: "关于", href: "/about" },
    { name: "归档", href: "/archive" },
    { name: "标签", href: "/tags" },
    { name: "地图", href: "/sitemap.xml" },
  ],

  // WordPress API 配置
  wordpress: {
    siteUrl: siteUrl || "https://www.frbkw.com", // 确保有默认值
    apiBase: "/wp-json/wp/v2",
    perPage: 30,
    cacheTimeout: 5 * 60 * 1000, // 5 分钟

    // ✅ 修复：使用更安全的方法构建 URL
    getApiUrl(endpoint = "") {
      // 1. 获取基础 URL，并移除末尾可能的斜杠
      const base = this.siteUrl?.replace(/\/$/, "");
      // 2. 获取 API 基础路径，并确保它以一个斜杠开头，但不要有末尾斜杠
      const apiBase = this.apiBase.replace(/^\/?/, "/").replace(/\/$/, "");
      // 3. 处理 endpoint，确保它以一个斜杠开头，用于拼接
      const path = endpoint ? `/${endpoint.replace(/^\/?/, "")}` : "";
      return `${base}${apiBase}${path}`;
    },

    // 常用端点
    get postsUrl() {
      return this.getApiUrl("posts");
    },

    get categoriesUrl() {
      return this.getApiUrl("categories");
    },

    get tagsUrl() {
      return this.getApiUrl("tags");
    },

    get pagesUrl() {
      return this.getApiUrl("pages");
    },

    // 获取单个文章
    getPostUrl(id) {
      return this.getApiUrl(`posts/${id}`);
    },

    // 获取文章链接（前端链接）
    getPostLink(slug) {
      const base = this.siteUrl?.replace(/\/$/, "");
      return `${base}/${slug}`;
    },
  },

  // 主题配置
  theme: {
    defaultMode: "system",
    accentColor: "#0070f3",
  },

  // 个人主页 / 关于我
  about: {
    avatar: "/images/logo.png",
    bio: "一个热爱技术与内容创作的开发者，专注于分享科技、互联网领域的优质内容。",
    description:
      "欢迎来到我的资讯站点。这里汇聚科技、财经、体育、娱乐等多领域的新闻资讯，致力于为您提供最新、最全的阅读体验。",

    // 社交链接（可选，显示在右侧栏底部）
    social: [
      { name: "抖音", url: "", icon: "tiktok" },
      { name: "GitHub", url: "https://github.com/seraluce", icon: "github" },
      { name: "X", url: "https://twitter.com/seraluce", icon: "x" },
      { name: "Email", url: "mailto:hello@example.com", icon: "gmail" },
      {
        name: "哔哩哔哩",
        url: "https://space.bilibili.com/",
        icon: "bilibili",
      },
    ],
  },

  // 右侧小组件配置
  widgets: {
    search: true,
    hotPosts: true,
    hotPostsCount: 10,
    tags: true,
    tagsCount: 10,
    copyright: true,
  },

  // 左侧分类菜单（如果从 WordPress 获取则使用 WordPress 数据）
  categories: [
    { name: "科技资讯", slug: "tech", icon: "", count: 128 },
    { name: "财经新闻", slug: "finance", icon: "", count: 96 },
    { name: "体育赛事", slug: "sports", icon: "", count: 74 },
    { name: "娱乐八卦", slug: "entertainment", icon: "", count: 112 },
    { name: "国际要闻", slug: "world", icon: "", count: 85 },
    { name: "社会民生", slug: "society", icon: "", count: 63 },
    { name: "健康生活", slug: "health", icon: "", count: 47 },
    { name: "教育文化", slug: "education", icon: "", count: 39 },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

// ✅ 添加验证函数
export function validateWordPressConfig() {
  const { siteUrl } = siteConfig.wordpress;

  if (!siteUrl || siteUrl === "undefined") {
    console.error("❌ [WordPress] WP_SITE_URL 未正确配置！");
    console.error(
      "   请在 .env.local 中设置: WP_SITE_URL=https://www.frbkw.com",
    );
    return false;
  }

  try {
    new URL(siteUrl);
    console.log("✅ [WordPress] 站点地址有效:", siteUrl);
    return true;
  } catch {
    console.error("❌ [WordPress] WP_SITE_URL 格式无效:", siteUrl);
    return false;
  }
}

// ✅ 导出工具函数
export const wpApi = {
  // 获取分类
  getCategories: async () => {
    const url = siteConfig.wordpress.categoriesUrl;
    if (!url || url.includes("undefined")) {
      throw new Error("WordPress 站点地址未配置");
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  // 获取文章列表
  getPosts: async (params = {}) => {
    const url = siteConfig.wordpress.postsUrl;
    if (!url || url.includes("undefined")) {
      throw new Error("WordPress 站点地址未配置");
    }
    const query = new URLSearchParams(params).toString();
    const fullUrl = query ? `${url}?${query}` : url;
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  // 获取单个文章
  getPost: async (id) => {
    const url = siteConfig.wordpress.getPostUrl(id);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
};
