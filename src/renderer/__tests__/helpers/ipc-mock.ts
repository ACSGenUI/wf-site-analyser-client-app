import { vi } from 'vitest';
import type { ElectronAPI } from '@shared/types';

type DeepMock<T> = {
  [K in keyof T]: T[K] extends (...args: never[]) => unknown
    ? ReturnType<typeof vi.fn>
    : T[K];
};

type MockAPI = DeepMock<ElectronAPI>;

export function createMockApi(overrides: Partial<MockAPI> = {}): MockAPI {
  const base: MockAPI = {
    getAppVersion: vi.fn().mockResolvedValue('2.4.0'),
    checkForUpdates: vi.fn().mockResolvedValue({ updateAvailable: false }),
    installUpdate: vi.fn().mockResolvedValue(undefined),
    onUpdateStatus: vi.fn().mockReturnValue(vi.fn()),
    getSessionId: vi.fn().mockResolvedValue('test-uuid-1234'),
    storeSet: vi.fn().mockResolvedValue(undefined),
    storeGet: vi.fn().mockResolvedValue(null),
    storeDelete: vi.fn().mockResolvedValue(undefined),
    'safeStorage:encrypt': vi.fn().mockResolvedValue(undefined),
    'safeStorage:decrypt': vi.fn().mockResolvedValue('decrypted-value'),
    'safeStorage:delete': vi.fn().mockResolvedValue(undefined),
    'auth:openOAuthWindow': vi
      .fn()
      .mockResolvedValue({ accessToken: 'mock-token', userId: 'user-123' }),
    'auth:signOut': vi.fn().mockResolvedValue(undefined),
    'auth:switchAccount': vi.fn().mockResolvedValue(undefined),
    'auth:getTokenClaims': vi
      .fn()
      .mockResolvedValue({ name: 'Test User', email: 'test@example.com', org: 'Test Org' }),
    'analysis:start': vi.fn().mockResolvedValue({ analysisId: 'analysis-123' }),
    'analysis:cancel': vi.fn().mockResolvedValue(undefined),
    'analysis:pause': vi.fn().mockResolvedValue(undefined),
    'analysis:resume': vi.fn().mockResolvedValue(undefined),
    'analysis:getStatus': vi.fn().mockResolvedValue({ status: 'running', progress: 68 }),
    'analysis:saveAutoSave': vi.fn().mockResolvedValue(undefined),
    'data:migrateGuestToAuth': vi.fn().mockResolvedValue({ success: true }),
    'data:discardGuestData': vi.fn().mockResolvedValue(undefined),
    'data:getStorageUsage': vi
      .fn()
      .mockResolvedValue({ usedBytes: 2_468_987_289, totalBytes: 10_737_418_240 }),
    'data:clearOldData': vi.fn().mockResolvedValue(undefined),
    'fs:openDialog': vi.fn().mockResolvedValue({ filePath: '/tmp/test.csv', content: '' }),
    'fs:exportFile': vi.fn().mockResolvedValue(undefined),
    'shell:openExternal': vi.fn().mockResolvedValue(undefined),
    'rag:buildKnowledgeBase': vi.fn().mockResolvedValue({ ready: true }),
    'rag:query': vi.fn().mockResolvedValue({ answer: 'Mock answer', sources: [] }),
    getEnv: vi.fn().mockResolvedValue({
      NODE_ENV: 'test',
      APP_STAGE: 'development',
      API_BASE_URL: 'http://localhost:3000',
    }),
    ping: vi.fn().mockResolvedValue({ pong: true, timestamp: Date.now() }),
  };

  return { ...base, ...overrides };
}

export function installMockApi(overrides: Partial<MockAPI> = {}): MockAPI {
  const mock = createMockApi(overrides);
  Object.defineProperty(window, 'api', { value: mock, writable: true, configurable: true });
  return mock;
}
