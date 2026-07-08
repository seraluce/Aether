import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const adapterPath = resolve(__dirname, '../node_modules/@astrojs/cloudflare/dist/index.js');

try {
  let content = readFileSync(adapterPath, 'utf-8');
  const target = 'if (!session?.driver) {';
  const replacement = 'if (session !== false && !session?.driver) {';
  if (content.includes(target) && !content.includes(replacement)) {
    content = content.replace(target, replacement);
    writeFileSync(adapterPath, content);
    console.log('[postinstall] Patched @astrojs/cloudflare session: false bug');
  } else if (content.includes(replacement)) {
    console.log('[postinstall] Already patched');
  } else {
    console.warn('[postinstall] Target pattern not found, adapter may have changed');
  }
} catch (e) {
  console.error('[postinstall] Failed to patch:', e.message);
}
