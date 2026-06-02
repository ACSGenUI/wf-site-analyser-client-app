// Auto-update integration point — activate fully in Epic 02.
//
// To activate:
//   1. Set a publish provider in electron-builder.yml (GitHub, S3, etc.)
//   2. Import autoUpdater from 'electron-updater' and call checkForUpdatesAndNotify()
//   3. Wire update events to IPC channels so the renderer can surface update UI
//
// The electron-updater package is already declared in dependencies — no install needed.
import type { BrowserWindow } from 'electron';

export function initAutoUpdater(_mainWindow: BrowserWindow): void {
  // TODO(Epic 02): wire up autoUpdater once publish config is in place.
  // if (process.env.NODE_ENV === 'production') {
  //   const { autoUpdater } = await import('electron-updater');
  //   autoUpdater.checkForUpdatesAndNotify();
  // }
}
