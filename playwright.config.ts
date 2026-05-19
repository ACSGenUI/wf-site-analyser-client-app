import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    // Electron apps don't use a browser viewport
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'electron',
      use: {
        // The built app entry point; run `npm run build` before `npm run test:e2e`
        executablePath: path.join(__dirname, 'out/main/index.js'),
      },
    },
  ],
});
