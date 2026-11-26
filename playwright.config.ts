import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:4173/kebun-ceria/',
    hasTouch: true,
    isMobile: false,
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173/kebun-ceria/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: 'phone-landscape', use: { viewport: { width: 844, height: 390 } } },
    { name: 'phone-portrait', use: { viewport: { width: 390, height: 844 } } },
  ],
});
