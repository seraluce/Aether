import { getPosts, getCategories, getTags } from '../lib/wordpress';
import { mapPost, mapCategory, mapTag } from '../lib/mappers';
import type { Post } from '../lib/mappers';
import { wpConfig } from '../config';

export interface SiteData {
  posts: Post[];
  categories: Array<{ name: string; slug: string; count: number; icon: string }>;
  tags: string[];
  hotPosts: Post[];
  error: string | null;
}

let cachedSiteData: SiteData | null = null;
let cacheTimestamp = 0;

export async function fetchSiteData(): Promise<SiteData> {
  const now = Date.now();
  if (cachedSiteData && now - cacheTimestamp < wpConfig.cacheTimeout) {
    return cachedSiteData;
  }

  try {
    const [wpPosts, wpCategories, wpTags] = await Promise.all([
      getPosts(1, wpConfig.perPage),
      getCategories(),
      getTags(),
    ]);

    const posts = wpPosts.map(mapPost);
    const categories = wpCategories.map(mapCategory);
    const tags = wpTags.map(mapTag);
    const hotPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);

    cachedSiteData = { posts, categories, tags, hotPosts, error: null };
    cacheTimestamp = now;
    return cachedSiteData;
  } catch (err) {
    console.error('Failed to fetch WordPress data:', err);
    const result = {
      posts: [],
      categories: [],
      tags: [],
      hotPosts: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
    if (cachedSiteData) {
      return cachedSiteData;
    }
    return result;
  }
}
