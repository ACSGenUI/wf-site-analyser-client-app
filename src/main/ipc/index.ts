import { existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { app, ipcMain } from 'electron';

import { IPC_CHANNELS, type AppEnv, type PingResult } from '../../shared/types';

function getStorePath(): string {
  return join(app.getPath('userData'), 'app-store.json');
}

function readStore(): Record<string, unknown> {
  const p = getStorePath();
  if (!existsSync(p)) return {};
  try {
    return JSON.parse(readFileSync(p, 'utf8')) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function writeStore(data: Record<string, unknown>): void {
  writeFileSync(getStorePath(), JSON.stringify(data, null, 2), 'utf8');
}

export function registerIpcHandlers(): void {
  ipcMain.handle(
    IPC_CHANNELS.PING,
    (): PingResult => ({
      pong: true,
      timestamp: Date.now(),
    }),
  );

  ipcMain.handle(IPC_CHANNELS.GET_APP_VERSION, () => app.getVersion());

  ipcMain.handle(
    IPC_CHANNELS.GET_ENV,
    (): AppEnv => ({
      NODE_ENV: process.env.NODE_ENV ?? 'production',
      APP_STAGE: process.env.APP_STAGE ?? 'production',
      API_BASE_URL: process.env.API_BASE_URL ?? '',
    }),
  );

  ipcMain.handle(IPC_CHANNELS.GET_SESSION_ID, () => readStore().sessionId ?? null);

  ipcMain.handle(IPC_CHANNELS.STORE_SET, (_event, key: string, value: unknown) => {
    const data = readStore();
    data[key] = value;
    writeStore(data);
  });

  ipcMain.handle(IPC_CHANNELS.STORE_GET, (_event, key: string) => readStore()[key] ?? null);

  ipcMain.handle(IPC_CHANNELS.STORE_DELETE, (_event, key: string) => {
    const data = readStore();
    delete data[key];
    writeStore(data);
  });

  ipcMain.handle(IPC_CHANNELS.DATA_GET_STORAGE, () => {
    const storePath = getStorePath();
    const usedBytes = existsSync(storePath) ? statSync(storePath).size : 0;
    const totalBytes = 10 * 1024 * 1024 * 1024; // 10 GB soft cap
    return { usedBytes, totalBytes };
  });

  ipcMain.handle(IPC_CHANNELS.DATA_CLEAR_OLD, () => {
    writeStore({});
  });
}
