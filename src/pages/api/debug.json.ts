import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ error: 'Endpoint disabled' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  });
};
