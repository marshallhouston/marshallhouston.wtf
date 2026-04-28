import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 1600 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();

const pages = [
  ['home', '/'],
  ['post', '/unpromptable/'],
  ['about', '/about/'],
  ['kernels', '/kernels/'],
  ['tags', '/tags/'],
];

for (const [name, path] of pages) {
  await page.goto(`https://marshallhouston.wtf${path}`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `/tmp/jekyll-${name}.png`, fullPage: true });
  await page.goto(`http://localhost:4321${path}`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `/tmp/astro-${name}.png`, fullPage: true });
  console.log(`captured ${name}`);
}

await browser.close();
