import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, it, expect } from 'vitest';

const ROOT = resolve(__dirname, '../../../../');

const pkgRaw = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
const pkg: { name: string; version: string; description: string } = pkgRaw;
const builderConfig = pkgRaw.build as Record<string, unknown>;
const viteConfig = readFileSync(resolve(ROOT, 'electron.vite.config.ts'), 'utf8');
const ipcSource = readFileSync(resolve(ROOT, 'src/main/ipc/index.ts'), 'utf8');

// ---------------------------------------------------------------------------
// TC-01 — Build produces optimized bundle
// ---------------------------------------------------------------------------
describe('TC-01: Build produces optimized bundle', () => {
  it('vite renderer build enables esbuild minification in production', () => {
    expect(viteConfig).toContain("minify: isProd ? 'esbuild' : false");
  });

  it('vite renderer build disables sourcemaps in production', () => {
    expect(viteConfig).toContain('sourcemap: false');
  });

  it('vite main/preload builds disable sourcemaps in production', () => {
    expect(viteConfig).toContain('sourcemap: !isProd');
  });
});

// ---------------------------------------------------------------------------
// TC-02 — App metadata is correct
// ---------------------------------------------------------------------------
describe('TC-02: App metadata is correct', () => {
  it('package.json has the correct app name', () => {
    expect(pkg.name).toBe('wf-site-analyser-client');
  });

  it('package.json has a non-empty description', () => {
    expect(pkg.description.length).toBeGreaterThan(0);
  });

  it('electron-builder config declares the correct bundle ID', () => {
    expect(builderConfig.appId).toBe('com.adobe.wf-site-analyser');
  });

  it('electron-builder config declares the correct product name', () => {
    expect(builderConfig.productName).toBe('WF Site Analyser');
  });

  it('electron-builder config targets a Universal macOS DMG', () => {
    const mac = builderConfig.mac as Record<string, unknown>;
    const macTarget = mac.target as { target: string; arch: string[] } | string;
    const targetName = typeof macTarget === 'string' ? macTarget : macTarget.target;
    const arch = typeof macTarget === 'object' ? macTarget.arch : [];
    expect(targetName).toBe('dmg');
    expect(arch).toContain('universal');
  });

  it('electron-builder config targets a Windows NSIS installer', () => {
    const win = builderConfig.win as Record<string, unknown>;
    expect(win.target).toBe('nsis');
  });
});

// ---------------------------------------------------------------------------
// TC-03 — Asar packaging is enabled
// ---------------------------------------------------------------------------
describe('TC-03: Asar packaging is enabled', () => {
  it('electron-builder config explicitly enables asar packaging', () => {
    expect(builderConfig.asar).toBe(true);
  });

  it('electron-builder config unpacks native addons from the asar archive', () => {
    const asarUnpack = builderConfig.asarUnpack as string[] | undefined;
    expect(asarUnpack).toBeDefined();
    expect((asarUnpack as string[]).length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// TC-04 — Version matches package.json
// ---------------------------------------------------------------------------
describe('TC-04: Version matches package.json', () => {
  it('package.json version is a valid semver string', () => {
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/);
  });

  it('IPC GET_APP_VERSION handler delegates to app.getVersion() (reads package.json at runtime)', () => {
    expect(ipcSource).toContain('app.getVersion()');
  });

  it('electron-builder config does not hardcode a version override', () => {
    expect(builderConfig.version).toBeUndefined();
  });
});
