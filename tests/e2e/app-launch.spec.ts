/**
 * TC-05 (E2E): Electron app launches and creates a visible window.
 *
 * Prerequisites: run `npm run build` before `npm run test:e2e`.
 *
 * Electron 32+ dropped --remote-debugging-port as a CLI flag accepted by the
 * binary, which breaks Playwright's _electron.launch() helper.  Instead we:
 *   1. Spawn Electron directly with PLAYWRIGHT_TEST=1 (the main process then
 *      calls app.commandLine.appendSwitch to enable CDP on port 9222).
 *   2. Poll until the CDP endpoint is up, then connect via connectOverCDP.
 */

import { spawn, type ChildProcess } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

import { test, expect, chromium, type Browser } from '@playwright/test';
import electronBin from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAIN_ENTRY = path.join(__dirname, '../../out/main/index.js');
const CDP_URL = 'http://127.0.0.1:9222';

async function waitForCDP(timeout = 15_000): Promise<Browser> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      return await chromium.connectOverCDP(CDP_URL);
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  throw new Error(`Electron CDP endpoint not ready after ${timeout}ms`);
}

async function getFirstPage(browser: Browser, timeout = 10_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    for (const ctx of browser.contexts()) {
      const pages = ctx.pages();
      if (pages.length > 0) return pages[0];
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('No Electron page available after timeout');
}

let electronProcess: ChildProcess;
let browser: Browser;

test.beforeAll(async () => {
  // ELECTRON_RUN_AS_NODE=1 (set by Claude Code and similar tools) causes
  // electron.exe to behave as plain Node.js — delete it so Electron boots normally.
  const { ELECTRON_RUN_AS_NODE: _removed, ...cleanEnv } = process.env;
  electronProcess = spawn(electronBin, [MAIN_ENTRY], {
    env: { ...cleanEnv, PLAYWRIGHT_TEST: '1' },
    stdio: 'ignore',
  });
  browser = await waitForCDP();
});

test.afterAll(async () => {
  await browser.close().catch(() => {});
  electronProcess.kill();
});

test.describe('TC-05: Electron window launch', () => {
  test('app opens at least one BrowserWindow', async () => {
    const pageCount = browser.contexts().flatMap((c) => c.pages()).length;
    expect(pageCount).toBeGreaterThanOrEqual(1);
  });

  test('main window has a non-empty title', async () => {
    const page = await getFirstPage(browser);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('renderer page contains the React root element', async () => {
    const page = await getFirstPage(browser);
    const root = await page.locator('#root').count();
    expect(root).toBe(1);
  });
});
