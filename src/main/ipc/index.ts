import { ipcMain, app, type IpcMainInvokeEvent } from 'electron';
import { autoUpdater } from 'electron-updater';
import { promises as fs } from 'fs';
import path from 'path';

import {
  IPC_CHANNELS,
  type AppEnv,
  type AutoSavePayload,
  type AutoSaveResult,
  type PingResult,
  type UpdateCheckResult,
} from '../../shared/types';

const UPDATE_CHECK_ENDPOINT = 'https://updates.example.com/api/v1/updates/check';

// We drive download + install manually so the renderer can show progress and
// the user must explicitly accept (mandatory-update modal). Without these
// flags, electron-updater would auto-download on check and auto-install on quit.
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

export function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.PING, (): PingResult => ({
    pong: true,
    timestamp: Date.now(),
  }));

  ipcMain.handle(IPC_CHANNELS.GET_APP_VERSION, () => app.getVersion());

  ipcMain.handle(
    IPC_CHANNELS.CHECK_FOR_UPDATES,
    async (): Promise<UpdateCheckResult> => {
      const url = `${UPDATE_CHECK_ENDPOINT}?version=${app.getVersion()}&platform=${process.platform}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Update check failed: HTTP ${res.status}`);
      }
      return (await res.json()) as UpdateCheckResult;
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.INSTALL_UPDATE,
    async (event: IpcMainInvokeEvent): Promise<void> => {
      const send = (channel: string, ...args: unknown[]): void => {
        if (!event.sender.isDestroyed()) {
          event.sender.send(channel, ...args);
        }
      };

      // Unpackaged builds (dev) have no update feed and electron-updater throws
      // on checkForUpdates(). Fall back to the demo lifecycle so the modal flow
      // is still exercisable locally.
      if (!app.isPackaged) {
        console.log('[install] dev fallback — simulating lifecycle');
        send(IPC_CHANNELS.UPDATE_STATUS, 'downloading');
        for (let pct = 25; pct <= 100; pct += 25) {
          await new Promise((r) => setTimeout(r, 500));
          send(IPC_CHANNELS.UPDATE_PROGRESS, pct);
        }
        send(IPC_CHANNELS.UPDATE_STATUS, 'installing');
        await new Promise((r) => setTimeout(r, 1500));
        send(IPC_CHANNELS.UPDATE_STATUS, 'restarting');
        return;
      }

      // Reset listeners so retries don't accumulate handlers across invocations.
      autoUpdater.removeAllListeners('download-progress');
      autoUpdater.removeAllListeners('update-downloaded');
      autoUpdater.removeAllListeners('error');

      autoUpdater.on('download-progress', (progress: { percent: number }) => {
        send(IPC_CHANNELS.UPDATE_STATUS, 'downloading');
        send(IPC_CHANNELS.UPDATE_PROGRESS, Math.round(progress.percent));
      });

      autoUpdater.on('update-downloaded', () => {
        send(IPC_CHANNELS.UPDATE_STATUS, 'installing');
        // Brief delay so the renderer can paint 'installing' before the app quits.
        setTimeout(() => {
          send(IPC_CHANNELS.UPDATE_STATUS, 'restarting');
          autoUpdater.quitAndInstall();
        }, 500);
      });

      autoUpdater.on('error', (err: Error) => {
        console.error('[autoUpdater] error:', err);
        send(IPC_CHANNELS.UPDATE_STATUS, 'error');
      });

      try {
        const checkResult = await autoUpdater.checkForUpdates();
        if (!checkResult) {
          send(IPC_CHANNELS.UPDATE_STATUS, 'error');
          return;
        }
        await autoUpdater.downloadUpdate();
      } catch (err) {
        console.error('[autoUpdater] downloadUpdate failed:', err);
        send(IPC_CHANNELS.UPDATE_STATUS, 'error');
      }
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.ANALYSIS_SAVE_AUTO,
    async (_event, payload?: AutoSavePayload): Promise<AutoSaveResult> => {
      const savedAt = new Date().toISOString();
      const filePath = path.join(app.getPath('userData'), 'autosave.json');
      const body: AutoSavePayload = {
        schemaVersion: 1,
        ...(payload ?? {}),
        savedAt,
      };
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf8');
      return { path: filePath, savedAt };
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.ANALYSIS_LOAD_AUTO_SAVE,
    async (): Promise<AutoSavePayload | null> => {
      const filePath = path.join(app.getPath('userData'), 'autosave.json');
      try {
        const raw = await fs.readFile(filePath, 'utf8');
        return JSON.parse(raw) as AutoSavePayload;
      } catch {
        // ENOENT (no autosave yet) or malformed JSON (corrupt file) → start fresh.
        return null;
      }
    },
  );

  ipcMain.handle(IPC_CHANNELS.GET_ENV, (): AppEnv => ({
    NODE_ENV: process.env.NODE_ENV ?? 'production',
    APP_STAGE: process.env.APP_STAGE ?? 'production',
    API_BASE_URL: process.env.API_BASE_URL ?? '',
  }));
}
