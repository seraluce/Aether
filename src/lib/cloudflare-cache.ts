interface KvNamespace {
  get(key: string, type?: string): Promise<unknown>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

function getKv(): KvNamespace | null {
  try {
    // @astrojs/cloudflare v14+: env is only available via cloudflare:workers import
    // This import is resolved by the adapter's Vite plugin at build time
    // and by the Workers runtime at request time.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('cloudflare:workers') as { env: Record<string, unknown> };
    return (mod.env?.CACHE as KvNamespace) ?? null;
  } catch {
    // Local dev without Workers runtime — KV unavailable
    return null;
  }
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const kv = getKv();
  if (!kv) return null;
  try {
    const val = await kv.get(key, 'json');
    return val as T | null;
  } catch {
    return null;
  }
}

export async function kvPut(key: string, value: unknown, ttl?: number) {
  const kv = getKv();
  if (!kv) return;
  try {
    const opts = ttl ? { expirationTtl: ttl } : {};
    await kv.put(key, JSON.stringify(value), opts);
  } catch {
    // fail open
  }
}
