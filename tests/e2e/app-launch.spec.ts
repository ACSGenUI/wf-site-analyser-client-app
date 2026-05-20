/**
 * TC-05 (E2E): Electron app launches and creates a visible window.
 *
 * Prerequisites: run `npm run build` before `npm run test:e2e`.
 * The Playwright `_electron` helper launches the compiled main process and
 * inspects the renderer window via Playwright's page API.
 */

import { test, expect, _electron as electron } from '@playwright/test';
import path from 'path';

const MAIN_ENTRY = path.join(__dirname, '../../out/main/index.js');

test.describe('TC-05: Electron window launch', () => {
  test('app opens at least one BrowserWindow', async () => {
    const app = await electron.launch({ args: [MAIN_ENTRY] });

    try {
      // Wait for the first window to be available
      await app.firstWindow();
      const windowCount = app.windows().length;
      expect(windowCount).toBeGreaterThanOrEqual(1);
    } finally {
      await app.close();
    }
  });

  test('main window has a non-empty title', async () => {
    const app = await electron.launch({ args: [MAIN_ENTRY] });

    try {
      const window = await app.firstWindow();
      const title = await window.title();
      expect(title.length).toBeGreaterThan(0);
    } finally {
      await app.close();
    }
  });

  test('renderer page contains the React root element', async () => {
    const app = await electron.launch({ args: [MAIN_ENTRY] });

    try {
      const window = await app.firstWindow();
      // The HTML shell mounts React at #root (see src/renderer/index.html)
      const root = await window.locator('#root').count();
      expect(root).toBe(1);
    } finally {
      await app.close();
    }
  });
});
