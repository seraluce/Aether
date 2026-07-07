// src/lib/wordpress.ts
import { wpConfig } from '../config';

function getSiteUrl(): string {
  return wpConfig.siteUrl;
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

    const data = await res.json() as T;
    setCache(cacheKey, data);
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
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
    _fields: 'id,name,slug',
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