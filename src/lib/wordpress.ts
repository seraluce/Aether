// src/lib/wordpress.ts
import { wpConfig } from '../config';
import { kvGet, kvPut } from './cloudflare-cache';

function getSiteUrl(): string {
  return wpConfig.siteUrl;
}

// DJB2 哈希函数（与 route-ids.ts 保持一致）
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

// 生成文章哈希：基于 id + date + modified + slug + title
export function generatePostHash(post: { id: number; date: string; modified?: string; slug: string; title: { rendered: string } }): string {
  const str = `${post.id}:${post.date}:${post.modified || ''}:${post.slug}:${post.title.rendered}`;
  return djb2Hash(str).toString(36);
}

// 文章哈希条目
export interface PostHashEntry {
  id: number;
  hash: string;
  slug: string;
}

// 缓存键前缀
const POST_HASHES_KEY = 'post_hashes_v1';
const ALL_POSTS_KEY = 'all_posts_v1';

// KV 长期存储 TTL：24 小时（增量同步数据）
const KV_LONG_TTL = 86400;

// 获取本地缓存的文章哈希列表
async function getCachedPostHashes(): Promise<PostHashEntry[]> {
  const cached = await kvGet<PostHashEntry[]>(POST_HASHES_KEY);
  return cached || [];
}

// 保存文章哈希列表到缓存
async function savePostHashes(hashes: PostHashEntry[]): Promise<void> {
  await kvPut(POST_HASHES_KEY, hashes, KV_LONG_TTL);
}

// 获取本地缓存的所有文章
async function getCachedAllPosts(): Promise<WPPost[]> {
  const cached = await kvGet<WPPost[]>(ALL_POSTS_KEY);
  return cached || [];
}

// 保存所有文章到缓存
async function saveAllPosts(posts: WPPost[]): Promise<void> {
  await kvPut(ALL_POSTS_KEY, posts, KV_LONG_TTL);
}

export interface WPPost {
  id: number;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  slug: string;
  categories: number[];
  tags: number[];
  author: number;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
    author?: Array<{ name: string; avatar_urls: Record<string, string> }>;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WPUser {
  id: number;
  name: string;
  avatar_urls: Record<string, string>;
}

export interface WPMedia {
  id: number;
  source_url: string;
  media_details: {
    sizes: Record<string, { source_url: string; width: number; height: number }>;
  };
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCacheKey(endpoint: string, params: Record<string, string>): string {
  return `${endpoint}?${new URLSearchParams(params).toString()}`;
}

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > wpConfig.cacheTimeout) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function wpFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const cacheKey = getCacheKey(endpoint, params);
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const kvCached = await kvGet<T>(cacheKey);
  if (kvCached) {
    setCache(cacheKey, kvCached);
    return kvCached;
  }

  const url = new URL(`${getSiteUrl()}${wpConfig.apiBase}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    console.log(`[wpFetch] ${url.toString()}`);
    const res = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`WordPress API error: ${res.status} ${res.statusText} for ${url} body=${body.slice(0, 200)}`);
    }

    const data = await res.json() as T;
    setCache(cacheKey, data);
    kvPut(cacheKey, data, Math.floor(wpConfig.cacheTimeout / 1000));
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`[wpFetch] Error fetching ${url}:`, err instanceof Error ? err.message : err);
    throw err;
  }
}

async function wpFetchWithHeaders(endpoint: string, params: Record<string, string> = {}): Promise<{ data: unknown; total: number; totalPages: number }> {
  const url = new URL(`${getSiteUrl()}${wpConfig.apiBase}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`WordPress API error: ${res.status} ${res.statusText} for ${url}`);
    }

    const total = parseInt(res.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    const data = await res.json();
    return { data, total, totalPages };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

const LIST_FIELDS = 'id,date,title,excerpt,slug,categories,tags,author,featured_media';

export async function getTotalPosts(): Promise<{ total: number; totalPages: number }> {
  const result = await wpFetchWithHeaders('/posts', {
    per_page: '1',
    page: '1',
    _fields: 'id',
  });
  return { total: result.total, totalPages: result.totalPages };
}

export async function getAllPosts(limitPages = 8): Promise<WPPost[]> {
  const perPage = 50;
  let totalPages = 1;
  try {
    const result = await getTotalPosts();
    totalPages = result.totalPages;
  } catch {
    return [];
  }

  const maxPages = Math.min(totalPages, limitPages);
  const allPosts: WPPost[] = [];
  const batch = [];

  for (let page = 1; page <= maxPages; page++) {
    batch.push(getPosts(page, perPage).catch(() => [] as WPPost[]));
  }

  const results = await Promise.all(batch);
  allPosts.push(...results.flat());

  return allPosts;
}

export async function getPosts(page = 1, perPage = wpConfig.perPage): Promise<WPPost[]> {
  return wpFetch<WPPost[]>('/posts', {
    _embed: 'true',
    page: String(page),
    per_page: String(perPage),
  });
}

export async function getPost(slug: string): Promise<WPPost> {
  const posts = await wpFetch<WPPost[]>('/posts', {
    _embed: 'true',
    slug,
  });
  return posts[0];
}

export async function getPostById(id: number): Promise<WPPost> {
  return wpFetch<WPPost>(`/posts/${id}`, {
    _embed: 'true',
  });
}

export async function getCategories(): Promise<WPCategory[]> {
  return wpFetch<WPCategory[]>('/categories', {
    per_page: '100',
    _fields: 'id,name,slug,count',
  });
}

export async function getTags(): Promise<WPTag[]> {
  return wpFetch<WPTag[]>('/tags', {
    per_page: '100',
    _fields: 'id,name,slug,count',
  });
}

export async function getPostsByCategory(categoryId: number, page = 1, perPage = wpConfig.perPage): Promise<WPPost[]> {
  return wpFetch<WPPost[]>('/posts', {
    _embed: 'true',
    categories: String(categoryId),
    page: String(page),
    per_page: String(perPage),
  });
}

export async function getPostsByTag(tagId: number, page = 1, perPage = wpConfig.perPage): Promise<WPPost[]> {
  return wpFetch<WPPost[]>('/posts', {
    _embed: 'true',
    tags: String(tagId),
    page: String(page),
    per_page: String(perPage),
  });
}

export async function searchPosts(query: string): Promise<WPPost[]> {
  return wpFetch<WPPost[]>('/posts', {
    _embed: 'true',
    search: query,
    per_page: '10',
  });
}

export async function getMedia(id: number): Promise<WPMedia> {
  return wpFetch<WPMedia>(`/media/${id}`);
}

export interface WPComment {
  id: number;
  post: number;
  parent: number;
  author_name: string;
  author_avatar_urls: Record<string, string>;
  date: string;
  content: { rendered: string };
}

export async function getComments(postId: number): Promise<WPComment[]> {
  return wpFetch<WPComment[]>('/comments', {
    post: String(postId),
    per_page: '100',
    orderby: 'date_gmt',
    order: 'asc',
  });
}

// ============================================================
// 增量拉取相关函数
// ============================================================

// 获取远程文章哈希列表（轻量级，只拉取 id + date + modified + slug + title）
async function fetchRemotePostHashes(): Promise<PostHashEntry[]> {
  const perPage = 100;
  const allHashes: PostHashEntry[] = [];

  const { total } = await getTotalPosts();
  const totalPages = Math.ceil(total / perPage);

  const batch: Promise<WPPost[]>[] = [];
  for (let page = 1; page <= totalPages; page++) {
    batch.push(
      wpFetch<WPPost[]>('/posts', {
        _fields: 'id,date,modified,slug,title',
        page: String(page),
        per_page: String(perPage),
      }).catch(() => [])
    );
  }

  const results = await Promise.all(batch);
  for (const posts of results) {
    for (const post of posts) {
      allHashes.push({
        id: post.id,
        hash: generatePostHash(post),
        slug: post.slug,
      });
    }
  }

  return allHashes;
}

// 根据 ID 列表批量拉取文章（带 _embed）
async function fetchPostsByIds(ids: number[]): Promise<WPPost[]> {
  if (ids.length === 0) return [];

  const perPage = 100;
  const allPosts: WPPost[] = [];

  // 分批请求
  for (let i = 0; i < ids.length; i += perPage) {
    const batchIds = ids.slice(i, i + perPage);
    try {
      const posts = await wpFetch<WPPost[]>('/posts', {
        _embed: 'true',
        include: batchIds.join(','),
        per_page: String(batchIds.length),
      });
      allPosts.push(...posts);
    } catch {
      // 单批失败不影响其他批次
    }
  }

  return allPosts;
}

export interface IncrementalSyncResult {
  posts: WPPost[];
  updatedCount: number;
  newCount: number;
  removedCount: number;
}

// 增量同步：只拉取变化和新增的文章
export async function incrementalSyncPosts(): Promise<IncrementalSyncResult> {
  // 1. 获取远程哈希列表
  const remoteHashes = await fetchRemotePostHashes();
  if (remoteHashes.length === 0) {
    return { posts: [], updatedCount: 0, newCount: 0, removedCount: 0 };
  }

  // 2. 获取本地缓存的哈希列表和文章
  const localHashes = await getCachedPostHashes();
  const localPosts = await getCachedAllPosts();

  // 3. 构建本地哈希映射
  const localHashMap = new Map<number, PostHashEntry>();
  for (const entry of localHashes) {
    localHashMap.set(entry.id, entry);
  }

  const localPostMap = new Map<number, WPPost>();
  for (const post of localPosts) {
    localPostMap.set(post.id, post);
  }

  // 4. 找出需要更新的文章（哈希不同）
  const updatedIds: number[] = [];
  const newIds: number[] = [];

  for (const remote of remoteHashes) {
    const local = localHashMap.get(remote.id);
    if (!local) {
      // 新文章
      newIds.push(remote.id);
    } else if (local.hash !== remote.hash) {
      // 更新的文章
      updatedIds.push(remote.id);
    }
  }

  // 5. 找出被删除的文章
  const remoteIdSet = new Set(remoteHashes.map((h) => h.id));
  const removedIds = localHashes.filter((h) => !remoteIdSet.has(h.id)).map((h) => h.id);

  // 6. 合并需要拉取的 ID
  const idsToFetch = [...new Set([...updatedIds, ...newIds])];

  // 7. 拉取变化的文章
  const fetchedPosts = idsToFetch.length > 0 ? await fetchPostsByIds(idsToFetch) : [];

  // 8. 合并文章列表
  const updatedPostMap = new Map<number, WPPost>();
  for (const post of localPosts) {
    if (!removedIds.includes(post.id)) {
      updatedPostMap.set(post.id, post);
    }
  }
  for (const post of fetchedPosts) {
    updatedPostMap.set(post.id, post);
  }

  // 保持按日期排序（最新的在前）
  const allPosts = Array.from(updatedPostMap.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 9. 更新缓存
  await savePostHashes(remoteHashes);
  await saveAllPosts(allPosts);

  return {
    posts: allPosts,
    updatedCount: updatedIds.length,
    newCount: newIds.length,
    removedCount: removedIds.length,
  };
}