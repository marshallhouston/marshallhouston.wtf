// @ts-check
const { test, expect } = require('@playwright/test');

const HOME = '/';
const POST = '/telemetry-then-systematize';
const OTHER_POST = '/lowerchaos';

test.describe('cap-toggle: basics', () => {
  test('Aa button visible in masthead', async ({ page }) => {
    await page.goto(HOME);
    await expect(page.locator('header.masthead .cap-toggle')).toBeVisible();
  });

  test('inline Aa button per post on home', async ({ page }) => {
    await page.goto(HOME);
    const inline = page.locator('.entry .cap-toggle');
    expect(await inline.count()).toBeGreaterThan(1);
  });

  test('inline Aa button on post page meta', async ({ page }) => {
    await page.goto(POST);
    await expect(page.locator('article.post header .cap-toggle')).toBeVisible();
  });

  test('home loads in lowerchaos by default', async ({ page }) => {
    await page.goto(HOME);
    const title = await page.locator('.entry-title a').first().textContent();
    expect(title?.trim()).toMatch(/^[a-z]/);
  });
});

test.describe('cap-toggle: text flips', () => {
  test('entry title flips to sentence case on toggle', async ({ page }) => {
    await page.goto(HOME);
    const titleEl = page.locator('.entry-title a').first();
    const before = (await titleEl.textContent())?.trim() ?? '';
    await page.locator('header.masthead .cap-toggle').click();
    const after = (await titleEl.textContent())?.trim() ?? '';
    expect(after).not.toBe(before);
    expect(after).toMatch(/^[A-Z]/);
  });

  test('excerpt flips to sentence case on toggle', async ({ page }) => {
    await page.goto(HOME);
    const exEl = page.locator('.excerpt').first();
    const before = (await exEl.textContent())?.trim() ?? '';
    await page.locator('header.masthead .cap-toggle').click();
    const after = (await exEl.textContent())?.trim() ?? '';
    expect(after).not.toBe(before);
    expect(after).toMatch(/^[A-Z]/);
  });

  test('excerpt sentence case capitalizes after period', async ({ page }) => {
    await page.goto(HOME);
    await page.locator('header.masthead .cap-toggle').click();
    const excerpts = await page.locator('.excerpt').allTextContents();
    const multi = excerpts.find((t) => /\.\s+\S/.test(t));
    if (!multi) test.skip(true, 'no multi-sentence excerpt');
    expect(multi).toMatch(/\.\s+[A-Z]/);
  });

  test('toggle off restores original casing', async ({ page }) => {
    await page.goto(HOME);
    const titleEl = page.locator('.entry-title a').first();
    const original = (await titleEl.textContent())?.trim() ?? '';
    const btn = page.locator('header.masthead .cap-toggle');
    await btn.click();
    await btn.click();
    const restored = (await titleEl.textContent())?.trim() ?? '';
    expect(restored).toBe(original);
  });

  test('site title flips on toggle', async ({ page }) => {
    await page.goto(HOME);
    const t = page.locator('header.masthead .site-title');
    const before = (await t.textContent())?.trim() ?? '';
    await page.locator('header.masthead .cap-toggle').click();
    const after = (await t.textContent())?.trim() ?? '';
    expect(after).not.toBe(before);
    expect(after).toMatch(/^M/);
  });

  test('"recent posts" subtitle becomes "Recent posts"', async ({ page }) => {
    await page.goto(HOME);
    await page.locator('header.masthead .cap-toggle').click();
    const txt = (await page.locator('.archive__subtitle').textContent())?.trim();
    expect(txt).toBe('Recent posts');
  });
});

test.describe('cap-toggle: post page', () => {
  test('post h1 flips on toggle', async ({ page }) => {
    await page.goto(POST);
    const h1 = page.locator('article.post header h1');
    const before = (await h1.textContent())?.trim() ?? '';
    await page.locator('article.post header .cap-toggle').click();
    const after = (await h1.textContent())?.trim() ?? '';
    expect(after).not.toBe(before);
    expect(after).toMatch(/^[A-Z]/);
  });
});

test.describe('cap-toggle: persistence', () => {
  test('preference persists across navigation', async ({ page }) => {
    await page.goto(HOME);
    await page.locator('header.masthead .cap-toggle').click();
    await page.goto(POST);
    const t = (await page.locator('header.masthead .site-title').textContent())?.trim();
    expect(t).toMatch(/^M/);
  });

  test('toggle off persists', async ({ page }) => {
    await page.goto(HOME);
    const btn = page.locator('header.masthead .cap-toggle');
    await btn.click();
    await btn.click();
    await page.goto(OTHER_POST);
    const t = (await page.locator('header.masthead .site-title').textContent())?.trim();
    expect(t).toMatch(/^m/);
  });
});

test.describe('cap-toggle: linkedin custom mode', () => {
  const LINKEDIN_POST = '/unpromptable';

  test('tooltip uses linkedin labels', async ({ page }) => {
    await page.goto(LINKEDIN_POST);
    const btn = page.locator('header.masthead .cap-toggle');
    await expect(btn).toHaveAttribute('data-tooltip', 'lol LINKEDIN YEAH');
    await btn.click();
    await expect(btn).toHaveAttribute('data-tooltip', 'lol');
  });

  test('toggle uppercases article body via data-linkedin', async ({ page }) => {
    await page.goto(LINKEDIN_POST);
    await page.locator('header.masthead .cap-toggle').click();
    await expect(page.locator('body')).toHaveAttribute('data-linkedin', 'on');
    const tt = await page.evaluate(
      () => getComputedStyle(document.querySelector('article.post')).textTransform
    );
    expect(tt).toBe('uppercase');
  });

  test('linkedin pref does not bleed to other posts', async ({ page }) => {
    await page.goto(LINKEDIN_POST);
    await page.locator('header.masthead .cap-toggle').click();
    await page.goto('/telemetry-then-systematize');
    expect(await page.locator('body').getAttribute('data-linkedin')).not.toBe('on');
  });
});

test.describe('cap-toggle: tooltip label', () => {
  test('off → "switch to standard capitalization"', async ({ page }) => {
    await page.goto(HOME);
    const btn = page.locator('header.masthead .cap-toggle');
    await expect(btn).toHaveAttribute('data-tooltip', 'switch to standard capitalization');
  });

  test('on → "switch to lowerchaos"', async ({ page }) => {
    await page.goto(HOME);
    const btn = page.locator('header.masthead .cap-toggle');
    await btn.click();
    await expect(btn).toHaveAttribute('data-tooltip', 'switch to lowerchaos');
  });
});
