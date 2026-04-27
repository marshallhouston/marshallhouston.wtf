// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://marshallhouston.wtf',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
