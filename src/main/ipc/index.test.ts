import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ipcMain } from 'electron';
import { registerIpcHandlers } from './index';
import { IPC_CHANNELS } from '../../shared/types';

vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn(),
  },
  app: {
    getVersion: vi.fn(() => '1.0.0'),
  },
}));

type HandlerCall = [string, (...args: unknown[]) => unknown];

describe('IPC Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register ping handler', () => {
    registerIpcHandlers();
    expect(ipcMain.handle).toHaveBeenCalledWith(IPC_CHANNELS.PING, expect.any(Function));
  });

  it('should register get version handler', () => {
    registerIpcHandlers();
    expect(ipcMain.handle).toHaveBeenCalledWith(IPC_CHANNELS.GET_APP_VERSION, expect.any(Function));
  });

  it('should register get env handler', () => {
    registerIpcHandlers();
    expect(ipcMain.handle).toHaveBeenCalledWith(IPC_CHANNELS.GET_ENV, expect.any(Function));
  });

  it('ping handler should return pong with timestamp', () => {
    registerIpcHandlers();
    const calls = vi.mocked(ipcMain.handle).mock.calls as HandlerCall[];
    const pingHandler = calls.find((call) => call[0] === IPC_CHANNELS.PING)?.[1];

    expect(pingHandler).toBeDefined();
    const result = pingHandler!() as { pong: boolean; timestamp: number };
    expect(result).toHaveProperty('pong', true);
    expect(result).toHaveProperty('timestamp');
    expect(typeof result.timestamp).toBe('number');
  });

  it('get version handler should return app version', () => {
    registerIpcHandlers();
    const calls = vi.mocked(ipcMain.handle).mock.calls as HandlerCall[];
    const versionHandler = calls.find((call) => call[0] === IPC_CHANNELS.GET_APP_VERSION)?.[1];

    expect(versionHandler).toBeDefined();
    const result = versionHandler!();
    expect(result).toBe('1.0.0');
  });

  it('get env handler should return environment variables', () => {
    process.env.NODE_ENV = 'development';
    process.env.APP_STAGE = 'staging';
    process.env.API_BASE_URL = 'https://api.example.com';

    registerIpcHandlers();
    const calls = vi.mocked(ipcMain.handle).mock.calls as HandlerCall[];
    const envHandler = calls.find((call) => call[0] === IPC_CHANNELS.GET_ENV)?.[1];

    expect(envHandler).toBeDefined();
    const result = envHandler!();
    expect(result).toEqual({
      NODE_ENV: 'development',
      APP_STAGE: 'staging',
      API_BASE_URL: 'https://api.example.com',
    });
  });

  it('get env handler should use default values when env vars are not set', () => {
    delete process.env.NODE_ENV;
    delete process.env.APP_STAGE;
    delete process.env.API_BASE_URL;

    registerIpcHandlers();
    const calls = vi.mocked(ipcMain.handle).mock.calls as HandlerCall[];
    const envHandler = calls.find((call) => call[0] === IPC_CHANNELS.GET_ENV)?.[1];

    const result = envHandler!();
    expect(result).toEqual({
      NODE_ENV: 'production',
      APP_STAGE: 'production',
      API_BASE_URL: '',
    });
  });

  it('should register all three handlers on initialization', () => {
    registerIpcHandlers();
    expect(ipcMain.handle).toHaveBeenCalledTimes(3);
  });
});
