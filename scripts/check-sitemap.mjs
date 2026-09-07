#!/usr/bin/env node
// A sitemap asserts that every URL in it is canonical, 200 and indexable. Google
// Search Console flagged all 22 of ours as "Alternate page with proper canonical
// tag" in Sept 2026, because `build.format: 'file'` made every canonical point at
// the .html twin. This fails the build if that invariant rots again.
//
// Checks, against dist/ rather than a running server so it needs no ports:
//   1. every sitemap URL has a built file behind it (not a 404)
//   2. no sitemap URL carries a trailing slash or an .html suffix (both redirect)
//   3. every sitemap URL is self-canonical
//   4. no sitemap URL is noindexed
//   5. no internal link in dist points at a redirecting shape

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const SITEMAP = join(DIST, 'sitemap-0.xml');

const norm = (u) => u.replace(/\/$/, '');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

// dist file backing a URL path: /about -> dist/about.html, / -> dist/index.html
function fileFor(pathname) {
  const clean = pathname.replace(/^\//, '').replace(/\/$/, '');
  const candidates = clean === ''
    ? ['index.html']
    : [`${clean}.html`, join(clean, 'index.html')];
  return candidates.map((c) => join(DIST, c)).find(existsSync) ?? null;
}

if (!existsSync(SITEMAP)) {
  console.error(`check-sitemap: ${SITEMAP} not found. run \`astro build\` first.`);
  process.exit(1);
}

const errors = [];
const locs = [...readFileSync(SITEMAP, 'utf-8').matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

if (locs.length === 0) errors.push('sitemap is empty');

for (const loc of locs) {
  const { pathname } = new URL(loc);

  if (pathname !== '/' && pathname.endsWith('/')) {
    errors.push(`${loc}: trailing slash, redirects to the unslashed form`);
  }
  if (pathname.endsWith('.html')) {
    errors.push(`${loc}: .html suffix, redirects to the extensionless form`);
  }

  const file = fileFor(pathname);
  if (!file) {
    errors.push(`${loc}: no built page in ${DIST}/, would 404`);
    continue;
  }

  const html = readFileSync(file, 'utf-8');

  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (!canonical) {
    errors.push(`${loc}: no canonical tag in ${file}`);
  } else if (norm(canonical) !== norm(loc)) {
    errors.push(`${loc}: canonical is ${canonical}, not self-referential`);
  }

  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';
  if (/noindex/i.test(robots)) {
    errors.push(`${loc}: noindexed (robots="${robots}") but listed in the sitemap`);
  }
}

// Internal links that would redirect. Trailing slashes and .html suffixes both
// 30x under the Caddyfile, and a site full of redirecting links is what raised
// GSC's "Page with redirect" alert.
for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf-8');
  const bad = new Set();
  for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) {
    if (href === '/') continue;
    if (href.endsWith('/') || href.endsWith('.html')) bad.add(href);
  }
  for (const href of bad) {
    errors.push(`${relative(DIST, file)}: links to ${href}, which redirects`);
  }
}

// The RSS feed shares the canonical shape. @astrojs/rss appends a trailing slash
// unless told not to, and that default regressed silently once already.
const feed = join(DIST, 'feed.xml');
if (existsSync(feed)) {
  for (const [, link] of readFileSync(feed, 'utf-8').matchAll(/<link>(.*?)<\/link>/g)) {
    if (new URL(link).pathname !== '/' && link.endsWith('/')) {
      errors.push(`feed.xml: <link>${link}</link> has a trailing slash, which redirects`);
    }
  }
}

if (errors.length) {
  console.error(`check-sitemap: ${errors.length} violation(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`check-sitemap: ${locs.length} sitemap URLs are 200, self-canonical and indexable`);
