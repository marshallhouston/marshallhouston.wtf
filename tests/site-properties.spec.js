// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');

const BASE = 'http://localhost:4000';

// standalone utility pages that don't use the site theme
const SKIP = ['/comparison.html', '/feedback.html', '/review.html'];

function getUrls() {
  const sitemap = fs.readFileSync('_site/sitemap.xml', 'utf-8');
  return [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map(m => m[1].replace(BASE, ''))
    .filter(path => !SKIP.includes(path));
}

const urls = getUrls();

for (const path of urls) {
  test.describe(path, () => {
    test('has capitalize toggle in masthead', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('.masthead .capitalize-toggle')).toBeVisible();
    });

    test('capitalize toggle changes site title text', async ({ page }) => {
      await page.goto(path);
      const btn = page.locator('.masthead .capitalize-toggle');
      const titleEl = page.locator('.site-title');
      const before = await titleEl.textContent();
      await btn.click();
      const after = await titleEl.textContent();
      expect(after).not.toBe(before);
    });

    test('has masthead navigation', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('.masthead')).toBeVisible();
      await expect(page.locator('.masthead .site-title')).toBeVisible();
    });

    test('has non-empty title tag', async ({ page }) => {
      await page.goto(path);
      const title = await page.title();
      expect(title.trim().length).toBeGreaterThan(0);
    });

    test('no horizontal overflow', async ({ page }) => {
      await page.goto(path);
      const hasOverflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasOverflow).toBe(false);
    });
  });
}
