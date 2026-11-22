import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  expect: { timeout: 5000 },
  use: { baseURL: 'http://127.0.0.1:3010', trace: 'retain-on-failure' },
  webServer: { command: process.env.CI ? 'npm run start -- --hostname 127.0.0.1 --port 3010' : 'npm run dev -- --hostname 127.0.0.1 --port 3010', url: 'http://127.0.0.1:3010', timeout: 90000, reuseExistingServer: !process.env.CI },
});
