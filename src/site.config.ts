// ============================================================
// 站点配置文件 — 所有站点设置集中在这里修改
// ============================================================

export const siteConfig = {
  // 站点基本信息
  site: {
    name: '资讯新闻',
    shortName: 'NEWS',
    description: '最新最全的新闻资讯平台，涵盖科技、财经、体育、娱乐、国际等多个领域',
    url: 'https://example.com',        // 你的站点地址
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
  },

  // SEO & 社交分享
  seo: {
    keywords: '新闻,资讯,科技,财经,体育,娱乐,国际',
    ogImage: '/images/og-image.png',
    twitterHandle: '',
  },

  // 备案信息
  legal: {
    icp: '京ICP备XXXXXXXX号',
    icpLink: 'https://beian.miit.gov.cn/',
    copyright: '© 2026 资讯新闻. All rights reserved.',
  },

  // 顶部导航菜单
  headerNav: [
    { name: '首页', href: '/', active: true },
    { name: '科技', href: '/category/tech' },
    { name: '财经', href: '/category/finance' },
    { name: '体育', href: '/category/sports' },
    { name: '娱乐', href: '/category/entertainment' },
    { name: '国际', href: '/category/world' },
  ],

  // 页脚链接
  footerLinks: [
    { name: '首页', href: '/' },
    { name: '科技', href: '/category/tech' },
    { name: '财经', href: '/category/finance' },
    { name: '体育', href: '/category/sports' },
    { name: '娱乐', href: '/category/entertainment' },
    { name: '国际', href: '/category/world' },
    { name: 'Sitemap', href: '/sitemap.xml' },
  ],

  // WordPress API 配置
  wordpress: {
    siteUrl: 'https://your-wordpress-site.com',
    apiBase: '/wp-json/wp/v2',
    perPage: 30,
    cacheTimeout: 5 * 60 * 1000, // 5 分钟
  },

  // 主题配置
  theme: {
    defaultMode: 'system' as 'light' | 'dark' | 'system',
    accentColor: '#0070f3',
  },

  // 社交链接（可选，显示在右侧栏底部）
  social: [
    // { name: 'GitHub', url: 'https://github.com/your-username', icon: 'github' },
    // { name: 'Twitter', url: 'https://twitter.com/your-username', icon: 'twitter' },
    // { name: 'WeChat', url: '', icon: 'wechat' },
    // { name: 'Email', url: 'mailto:you@example.com', icon: 'email' },
  ],

  // 右侧小组件配置
  widgets: {
    search: true,
    hotPosts: true,
    hotPostsCount: 5,
    tags: true,
    copyright: true,
  },

  // 左侧分类菜单（如果从 WordPress 获取则使用 WordPress 数据）
  categories: [
    { name: '科技资讯', slug: 'tech', icon: '💻', count: 128 },
    { name: '财经新闻', slug: 'finance', icon: '📈', count: 96 },
    { name: '体育赛事', slug: 'sports', icon: '⚽', count: 74 },
    { name: '娱乐八卦', slug: 'entertainment', icon: '🎬', count: 112 },
    { name: '国际要闻', slug: 'world', icon: '🌍', count: 85 },
    { name: '社会民生', slug: 'society', icon: '🏘️', count: 63 },
    { name: '健康生活', slug: 'health', icon: '🏥', count: 47 },
    { name: '教育文化', slug: 'education', icon: '📚', count: 39 },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
