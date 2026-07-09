import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');

function ensureCacheBinding(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const config = JSON.parse(raw);

    const hasCache = config.kv_namespaces?.some((kv) => kv.binding === 'CACHE');
    if (!hasCache) {
      config.kv_namespaces = config.kv_namespaces || [];
      config.kv_namespaces.push({ binding: 'CACHE', id: 'c42f0eafddf1441989bd28e1d29a0f09' });
    }

    writeFileSync(filePath, JSON.stringify(config));
    console.log(`[postbuild] Updated ${filePath}`);
  } catch (e) {
    // silent skip
  }
}

ensureCacheBinding(resolve(distDir, 'server/wrangler.json'));
ensureCacheBinding(resolve(distDir, 'server/.prerender/wrangler.json'));