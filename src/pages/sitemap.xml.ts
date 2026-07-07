import type { APIRoute } from 'astro';
import { getPosts, getCategories } from '../lib/wordpress';
import { mapPost, mapCategory } from '../lib/mappers';
import { mockData } from '../data/mock';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') || 'https://example.com';

  let posts = mockData.posts;
  let categories = mockData.categories;

  try {
    const [wpPosts, wpCategories] = await Promise.all([getPosts(1, 100), getCategories()]);
    posts = wpPosts.map(mapPost);
    categories = wpCategories.map(mapCategory);
  } catch {
    // fallback to mock data
  }

  const now = new Date().toISOString();

  const urls = [
    { loc: siteUrl, lastmod: now, changefreq: 'daily', priority: '1.0' },
    { loc: `${siteUrl}/search`, lastmod: now, changefreq: 'weekly', priority: '0.5' },
    ...categories.map((cat) => ({
      loc: `${siteUrl}/topic/${cat.slug}`,
      lastmod: now,
      changefreq: 'daily' as const,
      priority: '0.8',
    })),
    ...posts.map((post) => ({
      loc: `${siteUrl}/article/${post.id}`,
      lastmod: new Date(post.date).toISOString(),
      changefreq: 'weekly' as const,
      priority: '0.6',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml.trim(), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
