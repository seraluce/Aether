import { wpConfig } from '../config';

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

async function wpFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const cacheKey = getCacheKey(endpoint, params);
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const url = new URL(`${wpConfig.siteUrl}${wpConfig.apiBase}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status} ${res.statusText} for ${url}`);
  }

  const data = await res.json() as T;
  setCache(cacheKey, data);
  return data;
}

async function wpFetchWithHeaders(endpoint: string, params: Record<string, string> = {}): Promise<{ data: unknown; total: number; totalPages: number }> {
  const url = new URL(`${wpConfig.siteUrl}${wpConfig.apiBase}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status} ${res.statusText} for ${url}`);
  }

  const total = parseInt(res.headers.get('X-WP-Total') || '0', 10);
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
  const data = await res.json();
  return { data, total, totalPages };
}

export async function getTotalPosts(): Promise<{ total: number; totalPages: number }> {
  const result = await wpFetchWithHeaders('/posts', {
    per_page: '1',
    page: '1',
    _fields: 'id',
  });
  return { total: result.total, totalPages: result.totalPages };
}

export async function getAllPosts(): Promise<WPPost[]> {
  let totalPages = 1;
  try {
    const result = await getTotalPosts();
    totalPages = result.totalPages;
  } catch {
    return [];
  }

  const maxPages = Math.min(totalPages, 20);
  const batchSize = 5;
  const allPosts: WPPost[] = [];

  for (let start = 1; start <= maxPages; start += batchSize) {
    const end = Math.min(start + batchSize - 1, maxPages);
    const batch = [];
    for (let page = start; page <= end; page++) {
      batch.push(getPosts(page, wpConfig.perPage).catch(() => [] as WPPost[]));
    }
    const results = await Promise.all(batch);
    allPosts.push(...results.flat());
  }

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
    _fields: 'id,date,title,excerpt,slug,categories,tags,author,featured_media',
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
    _fields: 'id,name,slug',
  });
}

export async function getPostsByCategory(categorySlug: string, page = 1): Promise<WPPost[]> {
  return wpFetch<WPPost[]>('/posts', {
    _embed: 'true',
    categories: categorySlug,
    page: String(page),
    per_page: String(wpConfig.perPage),
    _fields: 'id,date,title,excerpt,slug,categories,tags,author,featured_media',
  });
}

export async function searchPosts(query: string): Promise<WPPost[]> {
  return wpFetch<WPPost[]>('/posts', {
    _embed: 'true',
    search: query,
    per_page: '10',
    _fields: 'id,date,title,excerpt,slug,categories,tags,author,featured_media',
  });
}

export async function getMedia(id: number): Promise<WPMedia> {
  return wpFetch<WPMedia>(`/media/${id}`);
}
