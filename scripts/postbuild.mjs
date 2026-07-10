import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');

function fixWranglerConfig(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const config = JSON.parse(raw);

    // Remove auto-added SESSION binding (session: false bug)
    if (config.kv_namespaces) {
      config.kv_namespaces = config.kv_namespaces.filter(
        (kv) => kv.binding !== 'SESSION'
      );
    }
    if (config.previews && config.previews.kv_namespaces) {
      config.previews.kv_namespaces = config.previews.kv_namespaces.filter(
        (kv) => kv.binding !== 'SESSION'
      );
    }

    // Workers deployment: remove pages_build_output_dir (not needed, and conflicts with main)
    delete config.pages_build_output_dir;

    // Remove absolute paths that break CI
    delete config.configPath;
    delete config.userConfigPath;

    writeFileSync(filePath, JSON.stringify(config, null, 2));
    console.log(`[postbuild] Updated ${filePath}`);
  } catch (e) {
    console.error(`[postbuild] Failed to fix ${filePath}:`, e.message);
  }
}

fixWranglerConfig(resolve(distDir, 'server/wrangler.json'));