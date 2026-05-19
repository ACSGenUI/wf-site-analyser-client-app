import { vi } from 'vitest';

export const app = {
  getVersion: vi.fn().mockReturnValue('2.4.0'),
  getPath: vi.fn().mockReturnValue('/mock/path'),
  quit: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  whenReady: vi.fn().mockResolvedValue(undefined),
  isPackaged: false,
  getName: vi.fn().mockReturnValue('WF Site Analyser'),
};

export const BrowserWindow = vi.fn().mockImplementation(() => ({
  loadURL: vi.fn(),
  loadFile: vi.fn(),
  on: vi.fn(),
  once: vi.fn(),
  show: vi.fn(),
  close: vi.fn(),
  destroy: vi.fn(),
  isDestroyed: vi.fn().mockReturnValue(false),
  webContents: {
    send: vi.fn(),
    on: vi.fn(),
    openDevTools: vi.fn(),
    setWindowOpenHandler: vi.fn(),
  },
}));

export const ipcMain = {
  handle: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  removeHandler: vi.fn(),
  removeAllListeners: vi.fn(),
};

export const ipcRenderer = {
  invoke: vi.fn().mockResolvedValue(undefined),
  on: vi.fn().mockReturnValue({ removeListener: vi.fn() }),
  off: vi.fn(),
  removeListener: vi.fn(),
  removeAllListeners: vi.fn(),
  send: vi.fn(),
};

export const contextBridge = {
  exposeInMainWorld: vi.fn(),
};

export const shell = {
  openExternal: vi.fn().mockResolvedValue(undefined),
  openPath: vi.fn().mockResolvedValue(''),
};

export const safeStorage = {
  encryptString: vi.fn().mockReturnValue(Buffer.from('encrypted')),
  decryptString: vi.fn().mockReturnValue('decrypted'),
  isEncryptionAvailable: vi.fn().mockReturnValue(true),
};

export const dialog = {
  showOpenDialog: vi.fn().mockResolvedValue({ canceled: false, filePaths: ['/mock/file.csv'] }),
  showSaveDialog: vi.fn().mockResolvedValue({ canceled: false, filePath: '/mock/output.json' }),
};

export const nativeTheme = {
  shouldUseDarkColors: false,
  on: vi.fn(),
  off: vi.fn(),
};

export const session = {
  defaultSession: {
    setPermissionRequestHandler: vi.fn(),
    webRequest: {
      onHeadersReceived: vi.fn(),
    },
  },
};

export default {
  app,
  BrowserWindow,
  ipcMain,
  ipcRenderer,
  contextBridge,
  shell,
  safeStorage,
  dialog,
  nativeTheme,
  session,
};
