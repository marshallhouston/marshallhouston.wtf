// @ts-check
// Every post ships its markdown source next to its HTML, so agents can fetch
// the content without the page chrome. Caddy serves these for
// `Accept: text/markdown` on the slashless URL; that negotiation needs Caddy
// and is not exercised here. This covers the half that can regress silently:
// the build actually emitting the files.
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

for (const file of files) {
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
