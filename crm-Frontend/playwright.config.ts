import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // folder containing your tests
  use: {
    baseURL: 'http://localhost:5173', // 👈 your app URL
    headless: false,                  // set to true if you don’t want to see the browser
    screenshot: 'on',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',               // Run tests in Chrome
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});
