// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import icon from 'astro-icon';

const isDev = process.argv.includes('dev');
const siteUrl = process.env.PUBLIC_WP_SITE_URL || process.env.WP_SITE_URL || 'https://www.frbkw.com';

export default defineConfig({
  site: siteUrl,
  output: 'server',
  integrations: [
    icon({
      // ✅ 明确指定使用 Iconify 的 simple-icons 图标集
      include: {
        'simple-icons': ['*'],  // 使用 Iconify 的 simple-icons
      },
      // ✅ 指定本地图标目录（如果不存在则创建）
      iconDir: 'src/icons',
    })
  ],
  adapter: isDev ? undefined : cloudflare({
    platformProxy: {
      enabled: process.env.USE_PLATFORM_PROXY === 'true',
    },
  }),
});