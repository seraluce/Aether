import { incrementalSyncPosts, getCategories, getTags } from '../lib/wordpress';
import { mapPost, mapCategory, mapTag } from '../lib/mappers';
import type { Post } from '../lib/mappers';
import { wpConfig } from '../config';

export interface SiteData {
  posts: Post[];
  categories: Array<{ name: string; slug: string; count: number; icon: string }>;
  tags: Array<{ name: string; count: number }>;
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

  let wpPosts: Awaited<ReturnType<typeof incrementalSyncPosts>>['posts'] = [];
  let wpCategories: Awaited<ReturnType<typeof getCategories>> = [];
  let wpTags: Awaited<ReturnType<typeof getTags>> = [];
  let fetchError: string | null = null;

  // 拉取文章
  try {
    console.log(`[fetchSiteData] Fetching posts from: ${import.meta.env.WP_SITE_URL || 'default'}`);
    const syncResult = await incrementalSyncPosts();
    wpPosts = syncResult.posts;
    console.log(`[fetchSiteData] Got ${wpPosts.length} posts`);

    if (syncResult.updatedCount > 0 || syncResult.newCount > 0 || syncResult.removedCount > 0) {
      console.log(
        `[Incremental Sync] updated: ${syncResult.updatedCount}, new: ${syncResult.newCount}, removed: ${syncResult.removedCount}`
      );
    }
  } catch (err) {
    console.error('[fetchSiteData] Failed to fetch posts:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    fetchError = err instanceof Error ? err.message : 'Failed to fetch posts';
  }

  // 拉取分类和标签（独立于文章）
  try {
    [wpCategories, wpTags] = await Promise.all([
      getCategories(),
      getTags(),
    ]);
  } catch (err) {
    console.error('Failed to fetch categories/tags:', err);
    if (!fetchError) {
      fetchError = err instanceof Error ? err.message : 'Failed to fetch categories/tags';
    }
  }

  // 文章和分类/标签都失败才算整体失败
  if (wpPosts.length === 0 && wpCategories.length === 0 && wpTags.length === 0 && fetchError) {
    if (cachedSiteData) {
      return cachedSiteData;
    }
    return {
      posts: [],
      categories: [],
      tags: [],
      hotPosts: [],
      error: fetchError,
    };
  }

  const posts = wpPosts.map(mapPost);
  const categories = wpCategories.map(mapCategory);
  const tags = wpTags.map(mapTag);
  const hotPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 8);

  cachedSiteData = { posts, categories, tags, hotPosts, error: null };
  cacheTimestamp = now;
  return cachedSiteData;
}
