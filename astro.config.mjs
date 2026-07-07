import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import icon from 'astro-icon';

const siteUrl = process.env.WP_SITE_URL;

export default defineConfig({
  site: siteUrl,
  output: 'static',  // 静态模式
  integrations: [icon()],
  adapter: cloudflare(),
});