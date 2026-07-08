import type { APIRoute } from 'astro';
import { getComments } from '../../lib/wordpress';

export const GET: APIRoute = async ({ url }) => {
  const postId = url.searchParams.get('postId');
  if (!postId) {
    return new Response(JSON.stringify({ error: 'Missing postId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const comments = await getComments(Number(postId));
    return new Response(JSON.stringify(comments), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to fetch comments' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { post, author_name, author_email, content, parent } = body;

    if (!post || !author_name || !content) {
      return new Response(JSON.stringify({ error: 'Missing required fields: post, author_name, content' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const wpUrl = import.meta.env.WP_SITE_URL || 'https://www.frbkw.com';
    const formData = new URLSearchParams();
    formData.set('comment', content);
    formData.set('author', author_name);
    formData.set('email', author_email || '');
    formData.set('comment_post_ID', String(post));
    if (parent) formData.set('comment_parent', String(parent));

    const res = await fetch(`${wpUrl}/wp-comments-post.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      redirect: 'manual',
    });

    if (res.status === 302) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const text = await res.text();
    const errorMatch = text.match(/<strong>(.*?)<\/strong>/);
    const errorMsg = errorMatch ? errorMatch[1] : '评论提交失败';
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
