const WORDS_PER_MIN = 265;

export function readMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MIN));
}

export function excerpt(body: string, max = 200): string {
  const stripped = body
    .replace(/^---[\s\S]*?---\n/, '')
    .replace(/^import\s.+?from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^export\s.+$/gm, '')
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

// Post frontmatter writes `updated_at` the way a human types it
// ("2026-04-20 17:03 MDT"). Schema.org's dateModified and og:modified_time
// both want ISO 8601, so translate. An unknown zone means we don't know the
// instant, and guessing would put dateModified off by hours, so return
// undefined and let the caller drop the field.
const ZONE_OFFSETS: Record<string, string> = {
  UTC: 'Z',
  GMT: 'Z',
  MDT: '-06:00',
  MST: '-07:00',
};

export function updatedIso(updatedAt?: string): string | undefined {
  if (!updatedAt) return undefined;

  const m = updatedAt
    .trim()
    .match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(:\d{2})?\s*([A-Za-z]+)?$/);
  if (!m) {
    const parsed = new Date(updatedAt);
    return Number.isNaN(parsed.valueOf()) ? undefined : parsed.toISOString();
  }

  const [, day, hhmm, seconds, zone] = m;
  const offset = zone ? ZONE_OFFSETS[zone.toUpperCase()] : 'Z';
  if (!offset) return undefined;

  const parsed = new Date(`${day}T${hhmm}${seconds ?? ':00'}${offset}`);
  return Number.isNaN(parsed.valueOf()) ? undefined : parsed.toISOString();
}

import { getCollection } from 'astro:content';

// Listings: drafts hidden everywhere (home, tags, feed, sitemap).
export async function getPosts() {
  const all = await getCollection('posts');
  return all.filter((p) => !p.data.draft);
}

// Routing: drafts are addressable at /<slug>/ in dev only, so the [slug]
// page can preview them. Prod build excludes them entirely.
export async function getRoutablePosts() {
  const all = await getCollection('posts');
  return import.meta.env.PROD ? all.filter((p) => !p.data.draft) : all;
}
