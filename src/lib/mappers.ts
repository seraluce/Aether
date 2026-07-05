import type { WPPost, WPCategory, WPTag } from '../lib/wordpress';

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  author: string;
  date: string;
  image: string;
  slug: string;
  tags: string[];
  views: number;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

function getFeaturedImage(post: WPPost): string {
  const media = post._embedded?.['wp:featuredmedia'];
  if (media && media.length > 0 && media[0].source_url) {
    return media[0].source_url;
  }
  const content = post.content?.rendered || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }
  const excerpt = post.excerpt?.rendered || '';
  const excerptImg = excerpt.match(/<img[^>]+src=["']([^"']+)["']/);
  if (excerptImg && excerptImg[1]) {
    return excerptImg[1];
  }
  return '';
}

function getCategories(post: WPPost): { name: string; slug: string } {
  const terms = post._embedded?.['wp:term'];
  if (terms && terms[0] && terms[0].length > 0) {
    return { name: terms[0][0].name, slug: terms[0][0].slug };
  }
  return { name: '未分类', slug: 'uncategorized' };
}

function getAuthor(post: WPPost): string {
  const authors = post._embedded?.author;
  if (authors && authors.length > 0) {
    return authors[0].name;
  }
  return '匿名';
}

function getTags(post: WPPost): string[] {
  const terms = post._embedded?.['wp:term'];
  if (terms && terms[1]) {
    return terms[1].map((t) => t.name);
  }
  return [];
}

export function mapPost(post: WPPost): Post {
  const cat = getCategories(post);
  return {
    id: post.id,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered).slice(0, 120) + '...',
    category: cat.name,
    categorySlug: cat.slug,
    author: getAuthor(post),
    date: post.date,
    image: getFeaturedImage(post),
    slug: post.slug,
    tags: getTags(post),
    views: Math.floor(Math.random() * 20000) + 1000,
  };
}

const emojiPool = [
  '💻', '📈', '⚽', '🎬', '🌍', '🏘️', '🏥', '📚',
  '🔥', '💡', '🎮', '🎵', '📱', '🚀', '🎯', '💎',
  '🌟', '🎨', '🔬', '📷', '🏆', '🎭', '🌈', '⚡',
  '🎪', '🧩', '🛠️', '📦', '🎲', '🔮', '🌸', '🍀',
];

function pickIcon(name: string, slug: string): string {
  const str = name + slug;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return emojiPool[Math.abs(hash) % emojiPool.length];
}

export function mapCategory(cat: WPCategory): { name: string; slug: string; count: number; icon: string } {
  return {
    name: cat.name,
    slug: cat.slug,
    count: cat.count,
    icon: pickIcon(cat.name, cat.slug),
  };
}

export function mapTag(tag: WPTag): string {
  return tag.name;
}
