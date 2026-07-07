import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import icon from 'astro-icon';

const siteUrl = process.env.PUBLIC_WP_SITE_URL || 'https://www.frbkw.com';

export default defineConfig({
  site: siteUrl,
  output: 'static',  // 静态模式
  integrations: [icon()],
  adapter: cloudflare(),
});