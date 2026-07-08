// src/pages/api/posts.json.js
export async function GET({ url }) {
  const siteUrl = import.meta.env.WP_SITE_URL || 'https://www.frbkw.com';
  const page = url.searchParams.get('page') || '1';
  const perPage = url.searchParams.get('per_page') || '20';

  try {
    const response = await fetch(
      `${siteUrl}/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}`
    );
    const posts = await response.json();

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '获取数据失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}