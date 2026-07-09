import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import icon from 'astro-icon';

const siteUrl = process.env.WP_SITE_URL || process.env.SITE_URL || 'https://www.frbkw.com';

export default defineConfig({
  site: siteUrl,
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
    session: false,
  }),
  integrations: [
    icon(),
  ],
});