#!/usr/bin/env node
// Removes ELECTRON_RUN_AS_NODE from the environment before launching electron-vite dev.
// This is required on Windows where the variable may be set to "1" by Claude Code or
// other tools that run Electron in Node.js mode (e.g. for their own internal use).
// On Linux/Mac the original `ELECTRON_RUN_AS_NODE= electron-vite dev` syntax handles this inline.

delete process.env.ELECTRON_RUN_AS_NODE;

const { spawnSync } = require('child_process');

const result = spawnSync('npx', ['electron-vite', 'dev'], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 0);
