// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://marshallhouston.wtf',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  redirects: {
    '/builder-vs-naysayers-ten-dimensions': '/builders-vs-naysayers-ten-dimensions',
    '/tools/builder-vs-naysayers': '/tools/builders-vs-naysayers',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/slides/'),
    }),
    mdx(),
  ],
});
