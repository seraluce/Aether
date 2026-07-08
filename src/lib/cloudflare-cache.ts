let _kv: any = null;

export function setKvNamespace(ns: any) {
  _kv = ns;
}

export function getKvNamespace() {
  return _kv;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  if (!_kv) return null;
  try {
    const val = await _kv.get(key, 'json');
    return val as T | null;
  } catch {
    return null;
  }
}

export async function kvPut(key: string, value: unknown, ttl = 300) {
  if (!_kv) return;
  try {
    await _kv.put(key, JSON.stringify(value), { expirationTtl: ttl });
  } catch {
    // fail open
  }
}
