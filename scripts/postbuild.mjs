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

    // 'ASSETS' is reserved in Pages projects
    delete config.assets;

    // Pages projects use pages_build_output_dir, not main
    delete config.main;

    // Remove absolute paths that break CI
    delete config.configPath;
    delete config.userConfigPath;
    if (config.pages_build_output_dir) {
      config.pages_build_output_dir = 'dist';
    }

    writeFileSync(filePath, JSON.stringify(config, null, 2));
    console.log(`[postbuild] Updated ${filePath}`);
  } catch (e) {
    console.error(`[postbuild] Failed to fix ${filePath}:`, e.message);
  }
}

fixWranglerConfig(resolve(distDir, 'server/wrangler.json'));