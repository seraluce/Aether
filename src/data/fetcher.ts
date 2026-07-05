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

export async function fetchSiteData(): Promise<SiteData> {
  try {
    const totalPages = 3;
    const postPromises = [];
    for (let page = 1; page <= totalPages; page++) {
      postPromises.push(getPosts(page, wpConfig.perPage));
    }

    const [wpPostsPages, wpCategories, wpTags] = await Promise.all([
      Promise.all(postPromises),
      getCategories(),
      getTags(),
    ]);

    const wpPosts = wpPostsPages.flat();
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
