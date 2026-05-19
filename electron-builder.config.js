// @ts-check
//
// Code-signing is controlled entirely via environment variables — no certificates are committed.
//   macOS: CSC_LINK (base64 .p12), CSC_KEY_PASSWORD, APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID
//   Windows: WIN_CSC_LINK (base64 .p12), WIN_CSC_KEY_PASSWORD
//
// electron-builder reads these automatically and skips signing when they are absent
// (safe for local development; CI injects them via GitHub Secrets).

/** @type {import('electron-builder').Configuration} */
const config = {
  appId: 'com.adobe.wf-site-analyser',
  productName: 'WF Site Analyser',
  copyright: 'Copyright © 2025 Adobe Inc.',

  directories: {
    buildResources: 'build',
    output: 'dist',
  },

  files: ['out/**', 'package.json', '!**/*.map'],

  asar: true,
  asarUnpack: ['**/*.node'],

  afterSign: 'scripts/notarize.mjs',

  // ── macOS — Universal DMG (Intel x64 + Apple Silicon arm64) ─────────────────
  mac: {
    category: 'public.app-category.productivity',
    icon: 'build/icons/icon.png',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
    target: [{ target: 'dmg', arch: ['universal'] }],
  },

  dmg: {
    title: '${productName} ${version}',
    contents: [
      { x: 130, y: 220 },
      { x: 410, y: 220, type: 'link', path: '/Applications' },
    ],
  },

  // ── Windows — NSIS installer (x64) ──────────────────────────────────────────
  win: {
    icon: 'build/icons/icon.png',
    target: [{ target: 'nsis', arch: ['x64'] }],
  },

  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: '${productName}',
  },

  // ── Auto-updater publish target — activate in Epic 02 ────────────────────────
  // When ready: replace null with a provider config, e.g.:
  //   publish: { provider: 'github', owner: '<org>', repo: 'wf-site-analyser-client' }
  publish: null,
};

module.exports = config;
