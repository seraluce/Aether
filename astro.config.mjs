import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://example.com',
  output: 'server',
  adapter: isDev ? undefined : cloudflare({
    platformProxy: {
      enabled: process.env.USE_PLATFORM_PROXY === 'true',
    },
  }),
});