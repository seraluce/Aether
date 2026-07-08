import { setKvNamespace } from './lib/cloudflare-cache';

export async function onRequest(context: any, next: any) {
  const runtime = context.locals.runtime;
  if (runtime?.env?.CACHE) {
    setKvNamespace(runtime.env.CACHE);
  }
  return next();
}
