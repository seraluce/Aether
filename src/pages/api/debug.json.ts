// src/pages/api/debug.json.ts
import type { APIRoute } from 'astro';
import { fetchSiteData } from '../../data/fetcher';

export const GET: APIRoute = async () => {
  const data = await fetchSiteData();
  return new Response(JSON.stringify({
    error: data.error,
    postsCount: data.posts.length,
    categoriesCount: data.categories.length,
    tagsCount: data.tags.length,
    firstPostTitle: data.posts[0]?.title || null,
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
