export function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return hash >>> 0;
}

export function slugToTopicId(slug: string): string {
  return String((djb2Hash(slug) % 90000000) + 10000000);
}

export function nameToTagId(name: string): string {
  return String((djb2Hash(name) % 900000) + 100000);
}

export function postToArticleId(id: number | string): string {
  return String((djb2Hash(String(id)) % 900000000000) + 100000000000);
}