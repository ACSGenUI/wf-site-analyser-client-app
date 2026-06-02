import path from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow } from 'electron';

import { registerIpcHandlers } from './ipc';
import { initAutoUpdater } from './services/updater';

// Electron 32+ dropped --remote-debugging-port as a CLI flag; it must be
// registered via app.commandLine before the app is ready.
if (process.env.PLAYWRIGHT_TEST === '1') {
  app.commandLine.appendSwitch('remote-debugging-port', '9222');
}

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: true,
    },
    titleBarStyle: 'hiddenInset',
    show: false,
  });

  registerIpcHandlers();

  if (process.env.NODE_ENV === 'development' && process.env.ELECTRON_RENDERER_URL) {
    // electron-vite injects ELECTRON_RENDERER_URL with the actual allocated port
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
    mainWindow.webContents.openDevTools({ mode: 'right' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  if (mainWindow) initAutoUpdater(mainWindow);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
