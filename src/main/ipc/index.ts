import { ipcMain, app } from 'electron';
import { IPC_CHANNELS, type PingResult, type AppEnv } from '../../shared/types';
import { registerStoreHandlers } from './store';

export function registerIpcHandlers(): void {
  registerStoreHandlers();
  ipcMain.handle(IPC_CHANNELS.PING, (): PingResult => ({
    pong: true,
    timestamp: Date.now(),
  }));

  ipcMain.handle(IPC_CHANNELS.GET_APP_VERSION, () => app.getVersion());

  ipcMain.handle(IPC_CHANNELS.GET_ENV, (): AppEnv => ({
    NODE_ENV: process.env.NODE_ENV ?? 'production',
    APP_STAGE: process.env.APP_STAGE ?? 'production',
    API_BASE_URL: process.env.API_BASE_URL ?? '',
  }));
}
