import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://marshallhouston.wtf/', { waitUntil: 'networkidle' });
const tokens = await page.evaluate(() => {
  const cs = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      bg: s.backgroundColor,
      color: s.color,
      font: s.fontFamily,
      size: s.fontSize,
      lh: s.lineHeight,
    };
  };
  const linkColor = (() => {
    const a = document.querySelector('main a, .archive a');
    return a ? getComputedStyle(a).color : null;
  })();
  return {
    body: cs('body'),
    masthead: cs('.masthead'),
    sidebar: cs('.author__avatar'),
    sidebarBio: cs('.author__bio'),
    title: cs('.archive__item-title, h2'),
    h1: cs('h1'),
    link: linkColor,
    main: cs('main, #main'),
  };
});
console.log(JSON.stringify(tokens, null, 2));
await browser.close();
