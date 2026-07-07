// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import icon from 'astro-icon';

const isDev = process.argv.includes('dev');
const siteUrl = process.env.WP_SITE_URL;

export default defineConfig({
  site: siteUrl,
  output: 'server',  // ✅ 保持 server，需要动态获取数据
  integrations: [
    icon({
      include: {
        'simple-icons': ['*'],
      },
      iconDir: 'src/icons',
    })
  ],
  adapter: cloudflare({
    // ✅ 明确禁用不需要的功能
    kv: false,
    imageService: 'passthrough',
    runtime: 'off',
  }),
});