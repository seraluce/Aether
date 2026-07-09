# Aether — AGENTS.md

Web: comments/docs in Chinese. Code identifiers in English.

## Commands

- `pnpm dev` — dev server on `0.0.0.0:4300`
- `pnpm build` — `astro build && node scripts/postbuild.mjs`
- `pnpm preview` — `wrangler pages dev dist`
- `pnpm deploy` — `wrangler pages deploy dist`
- `pnpm astro check` — type checks (Astro's built-in checker)

## Architecture

- **SSR** (server output), `@astrojs/cloudflare` adapter, Cloudflare Pages.
- **No tests** exist. No test framework installed.
- **No client framework** — pure Astro components + vanilla `<script>` tags.
- **CSS** — single `src/styles/global.css`, CSS custom properties for light/dark/system theme.
- **Content** — WordPress REST API headless CMS with in-memory (5 min) + KV cache, falls back to mock data.
- **KV namespaces** (from `wrangler.toml`): `CACHE`.
- **ID obfuscation** — `src/lib/route-ids.ts` uses DJB2 hash ranges (not raw WP IDs) in URLs.
- **Postinstall** patches `@astrojs/cloudflare` for a `session: false` bug.
- **Env**: `WP_SITE_URL` (required) — WordPress site URL.

## Key files

- `astro.config.mjs` — Astro config (site falls back to `WP_SITE_URL` → `SITE_URL` → hardcoded default)
- `src/config.ts` — runtime config from env vars
- `src/site.config.ts` — static site metadata, nav, theme
- `src/lib/wordpress.ts` — WP REST API client with dual cache
- `src/data/fetcher.ts` — orchestrates parallel WP fetches
- `src/data/mock.ts` — fallback data (8 articles, 8 categories)
