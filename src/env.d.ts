// src/env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly WP_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}