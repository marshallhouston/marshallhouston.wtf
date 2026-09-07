// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SITEMAP = path.join(__dirname, '..', 'dist', 'sitemap-0.xml');

const SKIP_PREFIXES = ['/slides'];
// pages with a custom cap-toggle (CSS-only transform, no textContent rewrite)
const SKIP_TITLE_TEXT_TEST = ['/unpromptable'];

function getUrls() {
  if (!fs.existsSync(SITEMAP)) {
    throw new Error(`sitemap not found at ${SITEMAP}. run \`bun run build\` first`);
  }
  const xml = fs.readFileSync(SITEMAP, 'utf-8');
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p) => !SKIP_PREFIXES.some((pre) => p.startsWith(pre)));
}

const urls = getUrls();

for (const urlPath of urls) {
  test.describe(urlPath, () => {
    test('has cap-toggle in masthead', async ({ page }) => {
      await page.goto(urlPath);
      await expect(page.locator('header.masthead .cap-toggle')).toBeVisible();
    });

    test('cap-toggle changes site title text', async ({ page }) => {
      test.skip(SKIP_TITLE_TEXT_TEST.includes(urlPath), 'custom cap-toggle uses CSS text-transform');
      await page.goto(urlPath);
      const btn = page.locator('header.masthead .cap-toggle');
      const titleEl = page.locator('header.masthead .site-title');
      const before = await titleEl.textContent();
      await btn.click();
      const after = await titleEl.textContent();
      expect(after).not.toBe(before);
    });

    test('has masthead navigation', async ({ page }) => {
      await page.goto(urlPath);
      await expect(page.locator('header.masthead')).toBeVisible();
      await expect(page.locator('header.masthead .site-title')).toBeVisible();
    });

    test('has non-empty title tag', async ({ page }) => {
      await page.goto(urlPath);
      const title = await page.title();
      expect(title.trim().length).toBeGreaterThan(0);
    });

    // Agents read the identity schema before anything else on the page. Every
    // page carries the Person and WebSite nodes, so landing on any one of them
    // answers "who wrote this" and "what site is this".
    test('has json-ld identifying the author and the site', async ({ page }) => {
      await page.goto(urlPath);
      const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
      expect(raw).toBeTruthy();
      const nodes = JSON.parse(raw)['@graph'];
      expect(Array.isArray(nodes)).toBe(true);
      const types = nodes.map((n) => n['@type']);
      expect(types).toContain('Person');
      expect(types).toContain('WebSite');
    });

    // A post's own node points back at those by @id, and its dates have to be
    // machine-readable: `updated_at` is authored as "2026-04-20 17:03 MDT".
    test('post json-ld links the author and uses iso dates', async ({ page }) => {
      await page.goto(urlPath);
      const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
      const nodes = JSON.parse(raw)['@graph'];
      const post = nodes.find((n) => String(n['@type']).endsWith('Posting'));
      test.skip(!post, 'not a post page');

      expect(post.author['@id']).toBe('https://marshallhouston.wtf/#person');
      expect(post.isPartOf['@id']).toBe('https://marshallhouston.wtf/#website');
      // canonical url, no trailing slash, matching <link rel="canonical">
      expect(post.url).toBe(`https://marshallhouston.wtf${urlPath}`);
      expect(new Date(post.datePublished).toISOString()).toBe(post.datePublished);
      if (post.dateModified) {
        expect(new Date(post.dateModified).toISOString()).toBe(post.dateModified);
      }
    });

    test('no horizontal overflow', async ({ page }) => {
      await page.goto(urlPath);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflow).toBe(false);
    });
  });
}
