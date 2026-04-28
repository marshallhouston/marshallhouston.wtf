const WORDS_PER_MIN = 200;

export function readMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MIN));
}

export function excerpt(body: string, max = 200): string {
  const stripped = body
    .replace(/^---[\s\S]*?---\n/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#+\s.*$/gm, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .trim();
  const para =
    stripped.split(/\n\s*\n/).find((p) => p.trim().length > 30) ?? '';
  const flat = para.replace(/\s+/g, ' ');
  return flat.length > max ? `${flat.slice(0, max)}...` : flat;
}

export function fmtDate(d: Date): string {
  return `${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getDate()).padStart(2, '0')} ${d.getFullYear()}`;
}

import { getCollection } from 'astro:content';

// Drafts visible in dev (`npm run dev`), hidden in prod builds.
export async function getPosts() {
  const all = await getCollection('posts');
  return import.meta.env.PROD ? all.filter((p) => !p.data.draft) : all;
}
