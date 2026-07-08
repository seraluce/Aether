import { writeFile, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const entryPath = resolve(distDir, 'server/entry.mjs');
const workerPath = resolve(distDir, '_worker.js');
const wranglerJsonPath = resolve(distDir, 'server/wrangler.json');

try {
  const entryContent = await readFile(entryPath, 'utf-8');
  await writeFile(workerPath, entryContent);
  console.log('[postbuild] Generated dist/_worker.js (inlined)');
} catch {
  console.warn('[postbuild] dist/server/entry.mjs not found, skipping _worker.js generation');
}

async function fixWranglerConfig(filePath, label) {
  try {
    const resolvedPath = resolve(filePath);
    console.log(`[postbuild] Fixing ${label} at ${resolvedPath}`);
    const raw = await readFile(resolvedPath, 'utf-8');
    const config = JSON.parse(raw);

    delete config.assets;
    delete config.main;
    delete config.rules;
    delete config.previews;
    delete config.no_bundle;

    const hasCache = config.kv_namespaces?.some((kv) => kv.binding === 'CACHE');
    if (!hasCache) {
      config.kv_namespaces = config.kv_namespaces || [];
      config.kv_namespaces.push({ binding: 'CACHE', id: 'c42f0eafddf1441989bd28e1d29a0f09' });
    }

    await writeFile(resolvedPath, JSON.stringify(config));
    console.log(`[postbuild] Fixed ${label} - wrote ${JSON.stringify(config).length} bytes`);
    console.log(`[postbuild]   assets=${!!config.assets}, main=${!!config.main}, no_bundle=${!!config.no_bundle}, kv=${config.kv_namespaces?.map(k=>k.binding).join(',')}`);
  } catch (e) {
    console.warn(`[postbuild] Could not fix ${label}: ${e.message}`);
  }
}

await fixWranglerConfig(wranglerJsonPath, 'wrangler.json');
await fixWranglerConfig(resolve(distDir, 'server/.prerender/wrangler.json'), '.prerender/wrangler.json');
