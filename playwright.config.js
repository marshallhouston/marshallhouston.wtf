// @ts-check
import { defineConfig } from '@playwright/test';

const PORT = 4321;
const BASE = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  timeout: 15000,
  retries: 0,
  use: {
    baseURL: BASE,
    headless: true,
  },
  reporter: 'list',
  webServer: {
    command: `bun run preview -- --port ${PORT} --host 127.0.0.1`,
    url: BASE,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
