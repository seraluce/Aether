import { getAllPosts } from './wordpress';
import { postToArticleId } from './route-ids';
import { kvGet, kvPut } from './cloudflare-cache';

const KV_CACHE_KEY = 'reverse-id-map';
const CACHE_TTL_MS = 5 * 60 * 1000;
const KV_TTL_SEC = 5 * 60;

let reverseMap: Map<string, number> | null = null;
let lastFetch = 0;

async function ensureMap(): Promise<Map<string, number>> {
  const now = Date.now();
  if (reverseMap && now - lastFetch < CACHE_TTL_MS) {
    return reverseMap;
  }

  const kvMap = await kvGet<Record<string, number>>(KV_CACHE_KEY);
  if (kvMap) {
    reverseMap = new Map(Object.entries(kvMap));
    lastFetch = now;
    return reverseMap;
  }

  const posts = await getAllPosts();
  const map = new Map<string, number>();
  for (const post of posts) {
    map.set(postToArticleId(post.id), post.id);
  }

  reverseMap = map;
  lastFetch = now;

  const obj: Record<string, number> = {};
  map.forEach((v, k) => { obj[k] = v; });
  await kvPut(KV_CACHE_KEY, obj, KV_TTL_SEC);

  return map;
}

export async function resolveArticleId(obfuscatedId: string): Promise<number | undefined> {
  const map = await ensureMap();
  return map.get(obfuscatedId);
}
