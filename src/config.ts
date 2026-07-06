import { siteConfig } from './site.config';

export interface WPConfig {
  siteUrl: string;
  apiBase: string;
  perPage: number;
  cacheTimeout: number;
}

export const wpConfig: WPConfig = {
  siteUrl: siteConfig.wordpress.siteUrl,
  apiBase: siteConfig.wordpress.apiBase,
  perPage: siteConfig.wordpress.perPage,
  cacheTimeout: siteConfig.wordpress.cacheTimeout,
};
