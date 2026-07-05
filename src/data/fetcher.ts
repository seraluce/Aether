import { getAllPosts, getCategories, getTags } from '../lib/wordpress';
import { mapPost, mapCategory, mapTag } from '../lib/mappers';
import type { Post } from '../lib/mappers';

export interface SiteData {
  posts: Post[];
  categories: Array<{ name: string; slug: string; count: number; icon: string }>;
  tags: string[];
  hotPosts: Post[];
  error: string | null;
}

export async function fetchSiteData(): Promise<SiteData> {
  try {
    const [wpPosts, wpCategories, wpTags] = await Promise.all([
      getAllPosts(),
      getCategories(),
      getTags(),
    ]);

    const posts = wpPosts.map(mapPost);
    const categories = wpCategories.map(mapCategory);
    const tags = wpTags.map(mapTag);
    const hotPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);

    return { posts, categories, tags, hotPosts, error: null };
  } catch (err) {
    console.error('Failed to fetch WordPress data:', err);
    return {
      posts: [],
      categories: [],
      tags: [],
      hotPosts: [],
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
