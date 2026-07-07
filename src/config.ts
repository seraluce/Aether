// src/config.ts
import { siteConfig } from "./site.config";

export interface WPConfig {
  siteUrl: string;
  apiBase: string;
  perPage: number;
  cacheTimeout: number;
}

export const wpConfig: WPConfig = {
  // ✅ 优先使用环境变量，fallback 到 siteConfig
  siteUrl:
    import.meta.env.WP_SITE_URL ||
    siteConfig.wordpress.siteUrl,
  apiBase: siteConfig.wordpress.apiBase,
  perPage: siteConfig.wordpress.perPage,
  cacheTimeout: siteConfig.wordpress.cacheTimeout,
};
