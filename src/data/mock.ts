import type { Post } from '../lib/mappers';

const categories = [
  { name: '科技资讯', slug: 'tech', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', count: 128 },
  { name: '财经新闻', slug: 'finance', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', count: 96 },
  { name: '体育赛事', slug: 'sports', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M12 14v7"/><path d="M9 21h6"/></svg>', count: 74 },
  { name: '娱乐八卦', slug: 'entertainment', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', count: 112 },
  { name: '国际要闻', slug: 'world', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>', count: 85 },
  { name: '社会民生', slug: 'society', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', count: 63 },
  { name: '健康生活', slug: 'health', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>', count: 47 },
  { name: '教育文化', slug: 'education', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>', count: 39 },
];

const tags = [
  { name: '人工智能', count: 42 },
  { name: '区块链', count: 18 },
  { name: '5G', count: 25 },
  { name: '新能源', count: 31 },
  { name: '元宇宙', count: 15 },
  { name: '数字经济', count: 28 },
  { name: '碳中和', count: 22 },
  { name: '芯片', count: 19 },
  { name: '云计算', count: 24 },
  { name: '物联网', count: 17 },
  { name: '大数据', count: 20 },
  { name: '智能家居', count: 12 },
  { name: '自动驾驶', count: 16 },
  { name: '虚拟现实', count: 11 },
  { name: '机器人', count: 13 },
];

const posts: Post[] = [
  {
    id: 1, title: '人工智能大模型再突破：新一代语言模型引领技术变革',
    excerpt: '最新发布的AI大模型在多项基准测试中刷新纪录，展现出前所未有的语言理解和推理能力，引发业界广泛关注。专家认为这标志着通用人工智能迈出了重要一步...',
    category: '科技资讯', categorySlug: 'tech', author: '张明远', date: '2026-07-05',
    image: '', slug: 'ai-breakthrough', tags: ['人工智能', '大数据'], views: 15420,
  },
  {
    id: 2, title: '全球股市震荡：多国央行调整货币政策应对通胀',
    excerpt: '受全球通胀压力影响，多国央行相继宣布调整利率政策。分析师认为这将对全球资本市场产生深远影响，投资者需密切关注后续走势...',
    category: '财经新闻', categorySlug: 'finance', author: '李晓峰', date: '2026-07-04',
    image: '', slug: 'stock-market', tags: ['数字经济', '碳中和'], views: 12380,
  },
  {
    id: 3, title: '世界杯预选赛战报：国足客场逆转取得关键三分',
    excerpt: '在昨晚进行的世界杯亚洲区预选赛中，中国男足在落后一球的情况下连进两球实现逆转，为晋级之路注入强心剂...',
    category: '体育赛事', categorySlug: 'sports', author: '王建国', date: '2026-07-04',
    image: '', slug: 'world-cup', tags: ['5G', '物联网'], views: 28900,
  },
  {
    id: 4, title: '新能源汽车销量再创新高：上半年渗透率突破50%',
    excerpt: '据最新统计数据显示，今年上半年新能源汽车销量同比增长45%，市场渗透率首次突破50%大关，标志着新能源汽车进入主流时代...',
    category: '科技资讯', categorySlug: 'tech', author: '陈思雨', date: '2026-07-03',
    image: '', slug: 'ev-sales', tags: ['新能源', '自动驾驶'], views: 9870,
  },
  {
    id: 5, title: '暑期档电影市场火爆：多部国产大片票房破十亿',
    excerpt: '今年暑期档电影市场表现强劲，多部国产影片票房突破十亿大关。业内分析认为，优质内容的持续输出是市场繁荣的关键...',
    category: '娱乐八卦', categorySlug: 'entertainment', author: '赵雅芝', date: '2026-07-03',
    image: '', slug: 'summer-movies', tags: ['虚拟现实', '人工智能'], views: 18650,
  },
  {
    id: 6, title: '芯片制造新突破：国产光刻机取得重要进展',
    excerpt: '国内半导体研发团队在光刻技术领域取得重大突破，成功研发出新一代关键设备，为芯片自主可控奠定坚实基础...',
    category: '科技资讯', categorySlug: 'tech', author: '刘志强', date: '2026-07-02',
    image: '', slug: 'chip-breakthrough', tags: ['芯片', '云计算'], views: 22100,
  },
  {
    id: 7, title: '联合国气候峰会达成新协议：各国承诺加速碳中和进程',
    excerpt: '在刚刚结束的联合国气候变化大会上，与会各国达成新一轮减排协议，承诺在2035年前将碳排放量降低60%...',
    category: '国际要闻', categorySlug: 'world', author: '孙海涛', date: '2026-07-02',
    image: '', slug: 'climate-summit', tags: ['碳中和', '新能源'], views: 8920,
  },
  {
    id: 8, title: '智慧城市建设提速：多个城市发布数字化转型方案',
    excerpt: '近期，北京、上海、深圳等多个城市相继发布智慧城市建设新方案，涵盖交通、医疗、教育等多个民生领域...',
    category: '社会民生', categorySlug: 'society', author: '周文静', date: '2026-07-01',
    image: '', slug: 'smart-city', tags: ['物联网', '大数据', '智能家居'], views: 6540,
  },
];

export const mockData = {
  posts,
  categories,
  tags,
  hotPosts: [...posts].sort((a, b) => b.views - a.views).slice(0, 5),
};
