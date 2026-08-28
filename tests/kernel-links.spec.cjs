// @ts-check
const { test, expect } = require('@playwright/test');

test('urls in kernel ideas render as links, not raw text', async ({ page }) => {
  await page.goto('/kernels');
  const body = await page.locator('main').innerText();
  expect(body).not.toContain('http');
  expect(body).not.toMatch(/\[[^\]]+\]\(/);
  const link = page.locator('main a.src').first();
  await expect(link).toHaveAttribute('href', /^https?:\/\//);
  await expect(page.getByRole('link', { name: 'meat proxy' })).toHaveAttribute(
    'href',
    'https://gruhn.me/blog/2026-08-03/'
  );
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);
});
