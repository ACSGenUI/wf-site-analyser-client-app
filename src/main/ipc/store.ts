import { ipcMain } from 'electron';
import ElectronStore from 'electron-store';
import { IPC_CHANNELS } from '../../shared/types';

const store = new ElectronStore<Record<string, unknown>>({ name: 'app-store' });

export function registerStoreHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.STORE_GET, (_event, key: string): unknown => {
    return store.get(key) ?? null;
  });

  ipcMain.handle(IPC_CHANNELS.STORE_SET, (_event, key: string, value: unknown): void => {
    store.set(key, value);
  });

  ipcMain.handle(IPC_CHANNELS.STORE_DELETE, (_event, key: string): void => {
    store.delete(key);
  });
}
