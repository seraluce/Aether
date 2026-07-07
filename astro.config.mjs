// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

const isDev = process.argv.includes('dev');

// ✅ 从环境变量读取站点 URL，使用WP_SITE_URL
const siteUrl = process.env.WP_SITE_URL

export default defineConfig({
  site: siteUrl,  // ✅ 使用变量
  output: 'server',
  adapter: isDev ? undefined : cloudflare({
    platformProxy: {
      enabled: process.env.USE_PLATFORM_PROXY === 'true',
    },
  }),
});