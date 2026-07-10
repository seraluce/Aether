import { wpFetch, getTotalPosts } from "./wordpress";
import { postToArticleId } from "./route-ids";

interface CacheEntry {
  map: Map<string, number>;
  timestamp: number;
}

let cached: CacheEntry | null = null;

export async function resolveArticleId(obfuscatedId: string): Promise<number | null> {
  const now = Date.now();
  const ttl = 5 * 60 * 1000;

  if (cached && now - cached.timestamp < ttl) {
    return cached.map.get(obfuscatedId) ?? null;
  }

  const { totalPages } = await getTotalPosts();
  const perPage = 100;
  const maxPages = Math.min(totalPages, 20);

  const batch = [];
  for (let page = 1; page <= maxPages; page++) {
    batch.push(
      wpFetch<{ id: number }[]>('/posts', {
        page: String(page),
        per_page: String(perPage),
        _fields: 'id',
      }).catch(() => []),
    );
  }

  const results = await Promise.all(batch);
  const map = new Map<string, number>();
  for (const page of results) {
    for (const post of page) {
      map.set(postToArticleId(post.id), post.id);
    }
  }

  cached = { map, timestamp: now };
  return map.get(obfuscatedId) ?? null;
}
