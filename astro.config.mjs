import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
 
export default defineConfig({
  site: 'https://example.com',
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: process.env.USE_PLATFORM_PROXY === 'true',
    },
  }),
});