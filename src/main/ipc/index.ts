import { promises as fs } from 'fs';
import path from 'path';

import { ipcMain, app, type IpcMainInvokeEvent } from 'electron';
import { autoUpdater } from 'electron-updater';

import {
  IPC_CHANNELS,
  type AppEnv,
  type AutoSavePayload,
  type AutoSaveResult,
  type CachedUpdateManifest,
  type PingResult,
  type UpdateCheckResult,
} from '../../shared/types';

const DEFAULT_UPDATE_CHECK_ENDPOINT = 'https://updates.example.com/api/v1/updates/check';
const UPDATE_CHECK_ENDPOINT = process.env.UPDATE_SERVER_URL ?? DEFAULT_UPDATE_CHECK_ENDPOINT;

const UPDATE_MANIFEST_CACHE_FILE = 'update-manifest.json';
const UPDATE_MANIFEST_CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function updateManifestCachePath(): string {
  return path.join(app.getPath('userData'), UPDATE_MANIFEST_CACHE_FILE);
}

async function readCachedUpdateManifest(): Promise<UpdateCheckResult | null> {
  try {
    const raw = await fs.readFile(updateManifestCachePath(), 'utf8');
    const parsed = JSON.parse(raw) as CachedUpdateManifest;
    const age = Date.now() - new Date(parsed.cachedAt).getTime();
    if (Number.isNaN(age) || age > UPDATE_MANIFEST_CACHE_MAX_AGE_MS) {
      console.log('[update-check] cached manifest stale, ignoring');
      return null;
    }
    return parsed.result;
  } catch {
    // ENOENT (no cache yet) or malformed JSON (corrupt cache) → no fallback.
    return null;
  }
}

async function writeCachedUpdateManifest(result: UpdateCheckResult): Promise<void> {
  const body: CachedUpdateManifest = { result, cachedAt: new Date().toISOString() };
  const filePath = updateManifestCachePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf8');
}

export function registerIpcHandlers(): void {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  ipcMain.handle(
    IPC_CHANNELS.PING,
    (): PingResult => ({
      pong: true,
      timestamp: Date.now(),
    }),
  );

  ipcMain.handle(IPC_CHANNELS.GET_APP_VERSION, () => app.getVersion());

  ipcMain.handle(IPC_CHANNELS.CHECK_FOR_UPDATES, async (): Promise<UpdateCheckResult> => {
    const url = `${UPDATE_CHECK_ENDPOINT}?version=${app.getVersion()}&platform=${process.platform}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Update check failed: HTTP ${res.status}`);
      }
      const result = (await res.json()) as UpdateCheckResult;
      // Best-effort cache write; never fail the call on cache write failure.
      writeCachedUpdateManifest(result).catch((err) =>
        console.warn('[update-check] cache write failed:', err),
      );
      return result;
    } catch (err) {
      const cached = await readCachedUpdateManifest();
      if (cached) {
        console.log('[update-check] network failed, serving cached manifest');
        return cached;
      }
      throw err;
    }
  });

  ipcMain.handle(IPC_CHANNELS.INSTALL_UPDATE, async (event: IpcMainInvokeEvent): Promise<void> => {
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
        // eslint-disable-next-line no-await-in-loop
        await new Promise<void>((r) => {
          setTimeout(r, 500);
        });
        send(IPC_CHANNELS.UPDATE_PROGRESS, pct);
      }
      send(IPC_CHANNELS.UPDATE_STATUS, 'installing');
      await new Promise<void>((r) => {
        setTimeout(r, 1500);
      });
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
  });

  ipcMain.handle(
    IPC_CHANNELS.ANALYSIS_SAVE_AUTO,
    async (_event, payload?: AutoSavePayload): Promise<AutoSaveResult> => {
      const savedAt = new Date().toISOString();
      const filePath = path.join(app.getPath('userData'), 'autosave.json');
      const body: AutoSavePayload = {
        ...(payload ?? {}),
        schemaVersion: 1,
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

  ipcMain.handle(
    IPC_CHANNELS.GET_ENV,
    (): AppEnv => ({
      NODE_ENV: process.env.NODE_ENV ?? 'production',
      APP_STAGE: process.env.APP_STAGE ?? 'production',
      API_BASE_URL: process.env.API_BASE_URL ?? '',
      UPDATE_SERVER_URL: UPDATE_CHECK_ENDPOINT,
    }),
  );
}
