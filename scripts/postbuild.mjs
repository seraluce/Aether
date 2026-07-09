import { writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const wranglerJsonPaths = [
  resolve(distDir, 'server/wrangler.json'),
  resolve(distDir, 'server/.prerender/wrangler.json'),
];

// Delete adapter-generated wrangler.json files - Pages doesn't use them and they cause conflicts
import { rmSync } from 'node:fs';
for (const filePath of wranglerJsonPaths) {
  try {
    rmSync(filePath);
    console.log(`[postbuild] Removed ${filePath}`);
  } catch (e) {
    // silent skip if file doesn't exist
  }
}