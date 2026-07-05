export interface WPConfig {
  siteUrl: string;
  apiBase: string;
  perPage: number;
  cacheTimeout: number;
}

export const wpConfig: WPConfig = {
  siteUrl: import.meta.env.WP_SITE_URL || 'https://your-wordpress-site.com',
  apiBase: '/wp-json/wp/v2',
  perPage: 10,
  cacheTimeout: 5 * 60 * 1000,
};
