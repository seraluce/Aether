import { getCachedPostHashes } from "./wordpress";
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

  const hashes = await getCachedPostHashes();
  if (hashes.length === 0) return null;

  const map = new Map<string, number>();
  for (const entry of hashes) {
    map.set(postToArticleId(entry.id), entry.id);
  }

  cached = { map, timestamp: now };
  return map.get(obfuscatedId) ?? null;
}
