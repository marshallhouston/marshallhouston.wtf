// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SITEMAP = path.join(__dirname, '..', 'dist', 'sitemap.xml');

const SKIP_PREFIXES = ['/slides/'];
// pages with a custom cap-toggle (CSS-only transform, no textContent rewrite)
const SKIP_TITLE_TEXT_TEST = ['/unpromptable/'];

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

    test('no horizontal overflow', async ({ page }) => {
      await page.goto(urlPath);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflow).toBe(false);
    });
  });
}
