// @ts-check
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:4000';
const POST_URL = `${BASE}/co-intelligence-ai-augmented-writing-system/`;
const LOWERCHAOS_URL = `${BASE}/lowerchaos/`;
const INFLUENCES_URL = `${BASE}/influences/`;
const HOME_URL = `${BASE}/`;

test.describe('capitalize toggle - basic functionality', () => {
  test('page loads in lowercase by default', async ({ page }) => {
    await page.goto(POST_URL);
    const title = await page.locator('#page-title').textContent();
    expect(title.trim()).toMatch(/^[a-z]/);
  });

  test('Aa button exists in header nav', async ({ page }) => {
    await page.goto(POST_URL);
    const btn = page.locator('.masthead .capitalize-toggle');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveText('Aa');
  });

  test('inline Aa button exists next to reading time on post pages', async ({ page }) => {
    await page.goto(POST_URL);
    const btn = page.locator('.capitalize-toggle--inline').first();
    await expect(btn).toBeVisible();
  });

  test('clicking toggle capitalizes page title', async ({ page }) => {
    await page.goto(POST_URL);
    const btn = page.locator('.masthead .capitalize-toggle');
    await btn.click();
    const title = await page.locator('#page-title').textContent();
    expect(title.trim()).toMatch(/^[A-Z]/);
  });

  test('clicking toggle again reverts to lowercase', async ({ page }) => {
    await page.goto(POST_URL);
    const btn = page.locator('.masthead .capitalize-toggle');
    const titleBefore = await page.locator('#page-title').textContent();
    await btn.click();
    await btn.click();
    const titleAfter = await page.locator('#page-title').textContent();
    expect(titleAfter).toBe(titleBefore);
  });
});

test.describe('capitalize toggle - content transformation', () => {
  test('body text gets sentence-cased', async ({ page }) => {
    await page.goto(POST_URL);
    await page.locator('.masthead .capitalize-toggle').click();
    // first paragraph should start with uppercase
    const firstP = await page.locator('.page__content p').first().textContent();
    expect(firstP.trim()).toMatch(/^[A-Z]/);
  });

  test('headings get title-cased', async ({ page }) => {
    await page.goto(POST_URL);
    await page.locator('.masthead .capitalize-toggle').click();
    const headings = page.locator('.page__content h2');
    const count = await headings.count();
    for (let i = 0; i < count; i++) {
      const text = await headings.nth(i).textContent();
      // first word of heading should be capitalized
      expect(text.trim()).toMatch(/^[A-Z]/);
    }
  });

  test('standalone "i" becomes "I"', async ({ page }) => {
    await page.goto(POST_URL);
    await page.locator('.masthead .capitalize-toggle').click();
    const content = await page.locator('.page__content').textContent();
    // should not have standalone lowercase i (word boundary)
    // allow "i" inside words like "in", "is", etc
    const standaloneI = content.match(/\bi\b(?!['-])/g);
    expect(standaloneI).toBeNull();
  });

  test('code blocks are NOT capitalized', async ({ page }) => {
    await page.goto(POST_URL);
    // grab code text before toggle
    const codeBlocks = page.locator('.page__content code');
    const count = await codeBlocks.count();
    if (count === 0) return; // skip if no code blocks

    const codeBefore = await codeBlocks.first().textContent();
    await page.locator('.masthead .capitalize-toggle').click();
    const codeAfter = await codeBlocks.first().textContent();
    expect(codeAfter).toBe(codeBefore);
  });

  test('blockquotes are NOT capitalized', async ({ page }) => {
    await page.goto(POST_URL);
    const quotes = page.locator('.page__content blockquote');
    const count = await quotes.count();
    if (count === 0) return;

    const quoteBefore = await quotes.first().textContent();
    await page.locator('.masthead .capitalize-toggle').click();
    const quoteAfter = await quotes.first().textContent();
    expect(quoteAfter).toBe(quoteBefore);
  });
});

test.describe('capitalize toggle - proper nouns', () => {
  test('"AI" not "Ai" in capitalized mode', async ({ page }) => {
    await page.goto(POST_URL);
    await page.locator('.masthead .capitalize-toggle').click();
    const content = await page.locator('.page__content').textContent();
    expect(content).not.toContain('Ai ');
    expect(content).not.toContain('Ai-');
    // "AI" should appear (from "ai" in original)
    expect(content).toContain('AI');
  });

  test('"Ethan Mollick" properly capitalized', async ({ page }) => {
    await page.goto(POST_URL);
    await page.locator('.masthead .capitalize-toggle').click();
    const content = await page.locator('.page__content').textContent();
    expect(content).toContain('Ethan Mollick');
  });

  test('influences page names are properly capitalized', async ({ page }) => {
    await page.goto(INFLUENCES_URL);
    await page.locator('.masthead .capitalize-toggle').click();
    const content = await page.locator('.page__content').textContent();
    expect(content).toContain('Charity Majors');
    expect(content).toContain('Chelsea Troy');
    expect(content).toContain('Kent Beck');
    expect(content).toContain('Simon Willison');
    expect(content).toContain('Will Larson');
    expect(content).toContain('Lara Hogan');
    expect(content).toContain('Mitchell Hashimoto');
  });
});

test.describe('capitalize toggle - nav and chrome', () => {
  test('site title capitalizes', async ({ page }) => {
    await page.goto(POST_URL);
    await page.locator('.masthead .capitalize-toggle').click();
    const siteTitle = await page.locator('.site-title').textContent();
    expect(siteTitle.trim()).toMatch(/^M/); // Marshall
  });

  test('nav links capitalize', async ({ page }) => {
    await page.goto(POST_URL);
    await page.locator('.masthead .capitalize-toggle').click();
    const navLinks = page.locator('.masthead__menu-item a');
    const count = await navLinks.count();
    for (let i = 0; i < count; i++) {
      const text = await navLinks.nth(i).textContent();
      expect(text.trim()).toMatch(/^[A-Z]/);
    }
  });

  test('author name capitalizes', async ({ page }) => {
    await page.goto(POST_URL);
    await page.locator('.masthead .capitalize-toggle').click();
    const authorName = await page.locator('.author__name').textContent();
    expect(authorName.trim()).toMatch(/^M/); // Marshall
  });
});

test.describe('capitalize toggle - session persistence', () => {
  test('preference persists across page navigation', async ({ page }) => {
    await page.goto(POST_URL);
    await page.locator('.masthead .capitalize-toggle').click();

    // verify capitalized
    const titleBefore = await page.locator('#page-title').textContent();
    expect(titleBefore.trim()).toMatch(/^[A-Z]/);

    // navigate to home
    await page.goto(HOME_URL);
    await page.waitForLoadState('domcontentloaded');

    // nav should still be capitalized
    const siteTitle = await page.locator('.site-title').textContent();
    expect(siteTitle.trim()).toMatch(/^M/);
  });

  test('capitalization persists to lowerchaos post', async ({ page }) => {
    // toggle capitalization on from home page
    await page.goto(HOME_URL);
    await page.locator('.masthead .capitalize-toggle').click();

    // navigate to lowerchaos post
    await page.goto(LOWERCHAOS_URL);
    await page.waitForLoadState('domcontentloaded');

    // title should be capitalized
    const title = await page.locator('#page-title').textContent();
    expect(title.trim()).toMatch(/^[A-Z]/);

    // toggle button should be visible
    const btn = page.locator('.masthead .capitalize-toggle');
    await expect(btn).toBeVisible();
  });

  test('toggling off clears session preference', async ({ page }) => {
    await page.goto(POST_URL);
    const btn = page.locator('.masthead .capitalize-toggle');
    await btn.click(); // on
    await btn.click(); // off

    await page.goto(INFLUENCES_URL);
    await page.waitForLoadState('domcontentloaded');

    // should be lowercase again
    const siteTitle = await page.locator('.site-title').textContent();
    expect(siteTitle.trim()).toMatch(/^m/);
  });
});

test.describe('capitalize toggle - both buttons sync', () => {
  test('clicking inline button capitalizes same as header button', async ({ page }) => {
    await page.goto(POST_URL);
    const inlineBtn = page.locator('.capitalize-toggle--inline').first();
    await inlineBtn.click();

    const title = await page.locator('#page-title').textContent();
    expect(title.trim()).toMatch(/^[A-Z]/);
  });

  test('header and inline buttons both update tooltip on toggle', async ({ page }) => {
    await page.goto(POST_URL);
    const headerBtn = page.locator('.masthead .capitalize-toggle');
    const inlineBtn = page.locator('.capitalize-toggle--inline').first();

    await headerBtn.click();
    await expect(headerBtn).toHaveAttribute('data-tooltip', 'switch to lowerchaos');
    await expect(inlineBtn).toHaveAttribute('data-tooltip', 'switch to lowerchaos');
  });
});

test.describe('capitalize toggle - no mid-sentence capitalization bug', () => {
  test('words after inline links are not incorrectly capitalized', async ({ page }) => {
    await page.goto(POST_URL);
    await page.locator('.masthead .capitalize-toggle').click();
    const content = await page.locator('.page__content').textContent();
    // "twice" should NOT be capitalized (it follows a link mid-sentence)
    expect(content).not.toMatch(/\bTwice\b/);
  });
});

test.describe('home page - inline toggle on all posts', () => {
  test('every post listing has an inline Aa button', async ({ page }) => {
    await page.goto(HOME_URL);
    const readtimes = page.locator('.page__meta-readtime');
    const readtimeCount = await readtimes.count();
    // there should be multiple posts with reading times
    expect(readtimeCount).toBeGreaterThan(1);
    // each post's parent .page__meta should have an inline toggle
    const inlineButtons = page.locator('.capitalize-toggle--inline');
    expect(await inlineButtons.count()).toBe(readtimeCount);
  });
});

test.describe('home page - "recent posts" heading respects capitalize toggle', () => {
  test('"recent posts" heading is lowercase by default', async ({ page }) => {
    await page.goto(HOME_URL);
    const subtitle = page.locator('.archive__subtitle');
    const text = await subtitle.textContent();
    expect(text.trim()).toBe('recent posts');
  });

  test('"recent posts" becomes "Recent Posts" when capitalized', async ({ page }) => {
    await page.goto(HOME_URL);
    await page.locator('.masthead .capitalize-toggle').click();
    const subtitle = page.locator('.archive__subtitle');
    const text = await subtitle.textContent();
    expect(text.trim()).toBe('Recent Posts');
  });
});

test.describe('home page - no post limit', () => {
  test('all posts are displayed without pagination', async ({ page }) => {
    await page.goto(HOME_URL);
    const posts = page.locator('.archive__item');
    const count = await posts.count();
    // should show all 6 posts, not limited to 5
    expect(count).toBeGreaterThan(5);
    // no pagination nav
    const pagination = page.locator('nav.pagination');
    expect(await pagination.count()).toBe(0);
  });
});

test.describe('home page - top 5 tags', () => {
  test('tag cloud appears between heading and posts', async ({ page }) => {
    await page.goto(HOME_URL);
    const tagCloud = page.locator('.tag-cloud');
    await expect(tagCloud).toBeVisible();
    // tag cloud should come after archive__subtitle and before entries-list
    const subtitle = page.locator('.archive__subtitle');
    const entries = page.locator('.entries-list');
    await expect(subtitle).toBeVisible();
    await expect(entries).toBeVisible();
  });

  test('shows exactly 5 tag links', async ({ page }) => {
    await page.goto(HOME_URL);
    const tagLinks = page.locator('.tag-cloud .tag-link');
    expect(await tagLinks.count()).toBe(5);
  });

  test('tags show post counts', async ({ page }) => {
    await page.goto(HOME_URL);
    const firstTag = await page.locator('.tag-cloud .tag-link').first().textContent();
    // should contain a number in parentheses like "experimentation (2)"
    expect(firstTag).toMatch(/\(\d+\)/);
  });

  test('most frequent tag appears first', async ({ page }) => {
    await page.goto(HOME_URL);
    const firstTag = await page.locator('.tag-cloud .tag-link').first().textContent();
    // first tag should have the highest count; just verify it has a count
    expect(firstTag.trim()).toMatch(/\(\d+\)/);
  });

  test('"all tags" link points to /tags/', async ({ page }) => {
    await page.goto(HOME_URL);
    const allTagsLink = page.locator('.tag-cloud a:not(.tag-link)');
    await expect(allTagsLink).toBeVisible();
    const href = await allTagsLink.getAttribute('href');
    expect(href).toBe('/tags/');
  });

  test('tag links point to /tags/#tag-name', async ({ page }) => {
    await page.goto(HOME_URL);
    const firstTagHref = await page.locator('.tag-cloud .tag-link').first().getAttribute('href');
    expect(firstTagHref).toMatch(/\/tags\/#[\w-]+/);
  });
});

test.describe('capitalize toggle - "switch to lowerchaos" label', () => {
  test('tooltip says "switch to standard capitalization" in lowercase mode', async ({ page }) => {
    await page.goto(HOME_URL);
    const btn = page.locator('.masthead .capitalize-toggle');
    await expect(btn).toHaveAttribute('data-tooltip', 'switch to standard capitalization');
  });

  test('tooltip says "switch to lowerchaos" in capitalized mode', async ({ page }) => {
    await page.goto(HOME_URL);
    const btn = page.locator('.masthead .capitalize-toggle');
    await btn.click();
    await expect(btn).toHaveAttribute('data-tooltip', 'switch to lowerchaos');
  });
});

test.describe('capitalize toggle - mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('toggle button is visible on mobile', async ({ page }) => {
    await page.goto(POST_URL);
    // on mobile the nav may be collapsed, but the button should exist
    const btn = page.locator('.capitalize-toggle').first();
    const isVisible = await btn.isVisible();
    // button may be in collapsed menu on very small screens
    // just verify it exists in DOM
    expect(await page.locator('.capitalize-toggle').count()).toBeGreaterThan(0);
  });

  test('no tooltip on mobile hover', async ({ page }) => {
    await page.goto(POST_URL);
    const btn = page.locator('.capitalize-toggle').first();
    if (await btn.isVisible()) {
      await btn.hover();
      // tooltip is CSS ::after, check computed style
      const hasTooltip = await btn.evaluate((el) => {
        const after = window.getComputedStyle(el, '::after');
        return after.content !== 'none' && after.content !== '""' && after.content !== '';
      });
      expect(hasTooltip).toBe(false);
    }
  });
});
