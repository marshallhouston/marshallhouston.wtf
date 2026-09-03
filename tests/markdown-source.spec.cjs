// @ts-check
// Every post, the homepage, and the prose pages (about, contact, privacy) ship
// a markdown source next to their HTML, so agents can fetch the content
// without the page chrome. Caddy serves these for `Accept: text/markdown` on
// the slashless URL; that negotiation needs Caddy and lives in
// scripts/check-negotiation.sh. This covers the half that can regress
// silently: the build actually emitting the files.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');

function markdownFiles() {
  if (!fs.existsSync(DIST)) {
    throw new Error(`dist not found at ${DIST}. run \`bun run build\` first`);
  }
  return fs.readdirSync(DIST).filter((f) => f.endsWith('.md'));
}

const files = markdownFiles();

test('posts emit markdown source', () => {
  expect(files.length).toBeGreaterThan(0);
});

// The trust-anchor pages agents check before recommending a site. They are
// authored as markdown in src/prose/ and rendered by a thin .astro page, so
// losing either half is a regression.
for (const page of ['about', 'contact', 'privacy']) {
  test(`/${page} ships html and markdown`, () => {
    expect(fs.existsSync(path.join(DIST, `${page}.html`))).toBe(true);
    expect(fs.existsSync(path.join(DIST, `${page}.md`))).toBe(true);
  });

  test(`/${page} has enough content to read as a real page`, () => {
    const body = fs
      .readFileSync(path.join(DIST, `${page}.md`), 'utf-8')
      .replace(/^---[\s\S]*?---/, '')
      .trim();
    expect(body.length).toBeGreaterThan(500);
  });
}

test('homepage ships a markdown index of the posts', () => {
  const md = fs.readFileSync(path.join(DIST, 'index.md'), 'utf-8');
  expect(md).toContain('source: "https://marshallhouston.wtf/"');
  expect(md).toContain('## recent posts');
  // every post in the build is listed
  for (const file of files.filter((f) => f !== 'index.md')) {
    const slug = file.replace(/\.md$/, '');
    if (['about', 'contact', 'privacy'].includes(slug)) continue;
    expect(md).toContain(`https://marshallhouston.wtf/${slug})`);
  }
});

for (const file of files.filter((f) => f !== 'index.md')) {
  const slug = file.replace(/\.md$/, '');

  test(`/${slug}.md is markdown source, not html`, async ({ request }) => {
    const res = await request.get(`/${file}`);
    expect(res.status()).toBe(200);

    const body = await res.text();
    expect(body.startsWith('---')).toBe(true);
    expect(body).toContain(`source: "https://marshallhouston.wtf/${slug}"`);
    expect(body).not.toContain('<!DOCTYPE html>');
  });

  test(`/${slug}.md has an html sibling`, () => {
    expect(fs.existsSync(path.join(DIST, `${slug}.html`))).toBe(true);
  });
}
