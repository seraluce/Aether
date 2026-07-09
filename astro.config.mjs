import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import icon from 'astro-icon';
import headersFile from 'astro-headers-file';  // 新增

const siteUrl = process.env.WP_SITE_URL || process.env.SITE_URL || 'https://www.frbkw.com';

export default defineConfig({
  site: siteUrl,
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
    session: false,
  }),
  vite: {
    define: {
      'import.meta.env.WP_SITE_URL': JSON.stringify(siteUrl),
    },
  },
  integrations: [
    icon(),
    headersFile({  // 新增
      rules: [
        {
          path: '/*',
          headers: {
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
          },
        },
        {
          path: '/_astro/*',
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        },
        {
          path: '/images/*',
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        },
        {
          path: '/*.html',
          headers: {
            'Cache-Control': 'public, max-age=0, must-revalidate',
          },
        },
      ],
    }),
  ],
});