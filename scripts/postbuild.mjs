import { writeFile, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const entryPath = resolve(distDir, 'server/entry.mjs');
const workerPath = resolve(distDir, '_worker.js');

try {
  await readFile(entryPath);
  const content = `import entry from './server/entry.mjs';
export default entry;
`;
  await writeFile(workerPath, content);
  console.log('[postbuild] Generated dist/_worker.js');
} catch {
  console.warn('[postbuild] dist/server/entry.mjs not found, skipping _worker.js generation');
}
