import { ipcMain, app } from 'electron';
import { IPC_CHANNELS } from '../../shared/types';
import path from 'path';
import fs from 'fs';

let store: Record<string, unknown> = {};
let storePath = '';

function loadStore(): void {
  try {
    storePath = path.join(app.getPath('userData'), 'app-store.json');
    if (fs.existsSync(storePath)) {
      store = JSON.parse(fs.readFileSync(storePath, 'utf-8')) as Record<string, unknown>;
    }
  } catch {
    store = {};
  }
}

function persistStore(): void {
  if (!storePath) return;
  try {
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');
  } catch {
    // best-effort — don't crash on write errors
  }
}

export function registerStoreHandlers(): void {
  loadStore();

  ipcMain.handle(IPC_CHANNELS.STORE_GET, (_event, key: string): unknown => {
    return store[key] ?? null;
  });

  ipcMain.handle(IPC_CHANNELS.STORE_SET, (_event, key: string, value: unknown): void => {
    store[key] = value;
    persistStore();
  });

  ipcMain.handle(IPC_CHANNELS.STORE_DELETE, (_event, key: string): void => {
    delete store[key];
    persistStore();
  });
}
