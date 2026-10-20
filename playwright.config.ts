import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    locale: 'en-US',
    timezoneId: 'UTC',
    viewport: { width: 1280, height: 800 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium' },
    { name: 'chrome', use: { channel: 'chrome' } },
    { name: 'msedge', use: { channel: 'msedge' } },
  ],
  webServer: {
    // Serve the built Worker directly: Vite's preview proxy returned a
    // Miniflare dispatchFetch 500 for /time-core on Windows Edge reload.
    command: 'npx wrangler dev --config build/server/wrangler.json --local --ip 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/time-core',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
