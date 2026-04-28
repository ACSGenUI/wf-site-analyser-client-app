/**
 * SA-303: Local Data Persistence
 *
 * Tests that analysis results, project state, and conversation history are
 * saved to local storage keyed by the anonymous user ID, and are retrieved
 * correctly across simulated restarts.
 *
 * Test File: src/renderer/__tests__/auth/LocalDataPersistence.test.tsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PersistenceService } from '@/services/persistenceService';
import { useProjectStore } from '@/store/projectStore';

const GUEST_USER_ID = 'guest-uuid-1111';

describe('SA-303 – Local Data Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC-01: Analysis result saved with user-scoped key
  it('TC-01: saves analysis result under a key scoped to the anonymous user ID', async () => {
    const service = new PersistenceService(GUEST_USER_ID);
    const mockResult = { analysisId: 'analysis-001', url: 'https://example.com', status: 'completed' };
    await service.saveAnalysisResult(mockResult);
    expect(window.api.storeSet).toHaveBeenCalledWith(
      `${GUEST_USER_ID}:analyses:analysis-001`,
      expect.objectContaining({ analysisId: 'analysis-001' }),
    );
  });

  // TC-02: Persisted data reloaded on restart
  it('TC-02: previously saved projects are loaded from storage on mount', async () => {
    const storedProjects = [{ id: 'proj-1', name: 'Test Project', createdAt: '2026-04-10' }];
    vi.mocked(window.api.storeGet).mockImplementation(async (key: string) => {
      if (key === `${GUEST_USER_ID}:projects`) return storedProjects;
      return null;
    });
    const store = useProjectStore.getState();
    await store.loadProjects(GUEST_USER_ID);
    expect(store.projects).toHaveLength(1);
    expect(store.projects[0].name).toBe('Test Project');
  });

  // TC-03: Chat history persisted
  it('TC-03: conversation messages are saved to local storage with userId scope', async () => {
    const service = new PersistenceService(GUEST_USER_ID);
    const messages = [
      { role: 'user', content: 'What blocks were found?' },
      { role: 'assistant', content: 'Three blocks: Hero, Nav, Footer.' },
    ];
    await service.saveChatHistory('analysis-001', messages);
    expect(window.api.storeSet).toHaveBeenCalledWith(
      `${GUEST_USER_ID}:chat:analysis-001`,
      messages,
    );
  });

  // TC-04: Data keys include userId for future migration
  it('TC-04: all storage keys are prefixed with the user ID', async () => {
    const service = new PersistenceService(GUEST_USER_ID);
    await service.saveAnalysisResult({ analysisId: 'a-001', url: 'https://foo.com', status: 'running' });
    const [calledKey] = vi.mocked(window.api.storeSet).mock.calls[0];
    expect(calledKey).toMatch(new RegExp(`^${GUEST_USER_ID}:`));
  });

  // TC-05: Empty storage returns empty project list without error
  it('TC-05: returns empty project list when storage has no data', async () => {
    vi.mocked(window.api.storeGet).mockResolvedValue(null);
    const store = useProjectStore.getState();
    await store.loadProjects(GUEST_USER_ID);
    expect(store.projects).toHaveLength(0);
  });
});
