import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 1800 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const urls = [
  ['home', 'https://marshallhouston.wtf/'],
  ['post', 'https://marshallhouston.wtf/unpromptable/'],
  ['about', 'https://marshallhouston.wtf/about/'],
  ['kernels', 'https://marshallhouston.wtf/kernels/'],
];
for (const [name, url] of urls) {
  await page.goto(url, { waitUntil: 'networkidle' });
  const path = `/tmp/jekyll-${name}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`saved ${path}`);
}
await browser.close();
