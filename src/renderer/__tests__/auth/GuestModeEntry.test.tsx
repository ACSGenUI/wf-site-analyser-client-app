/**
 * SA-301: Guest Mode Entry
 *
 * Tests that the app launches directly to the Dashboard without a sign-in
 * gate, generates a persistent anonymous UUID, and keeps a "LOCAL SESSION"
 * badge visible in the header throughout the session.
 *
 * Test File: src/renderer/__tests__/auth/GuestModeEntry.test.tsx
 */

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { App } from '@/App';
import { Header } from '@/components/Header';
import { useSessionStore } from '@/store/sessionStore';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>,
  );
}

function renderHeaderWithGuestSession() {
  const store = useSessionStore.getState();
  store.initGuestSession('test-uuid-1234');
  return render(<Header />);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SA-301 – Guest Mode Entry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the session store to its initial state between tests
    useSessionStore.setState({ mode: 'guest', userId: null, createdAt: null });
  });

  // TC-01: App launches to Dashboard without sign-in
  it('TC-01: app renders the Dashboard directly with no sign-in gate', async () => {
    renderApp('/');
    await waitFor(() => {
      // Dashboard landmark or heading should be present
      expect(
        screen.getByRole('main') ?? screen.getByText(/welcome to your workspace/i),
      ).toBeInTheDocument();
    });
    // The sign-in screen should NOT be present
    expect(screen.queryByText(/sign in with adobe ims/i)).toBeNull();
  });

  // TC-02: UUID generated on first launch
  it('TC-02: a valid UUID is created and stored in electron-store on first boot', async () => {
    vi.mocked(window.api.storeGet).mockResolvedValue(null); // No existing UUID
    renderApp('/');
    await waitFor(() => {
      expect(window.api.storeSet).toHaveBeenCalledWith(
        'sessionId',
        expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
      );
    });
  });

  // TC-03: UUID persists across restarts
  it('TC-03: the same UUID is reloaded from storage on subsequent launches', async () => {
    const savedUUID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    vi.mocked(window.api.storeGet).mockResolvedValue(savedUUID);
    renderApp('/');
    await waitFor(() => {
      expect(window.api.storeGet).toHaveBeenCalledWith('sessionId');
    });
    // storeSet should NOT be called with a new UUID
    const setCallWithUUID = vi
      .mocked(window.api.storeSet)
      .mock.calls.find(([key, value]) => key === 'sessionId' && value !== savedUUID);
    expect(setCallWithUUID).toBeUndefined();
  });

  // TC-04: LOCAL SESSION badge shown in header
  it('TC-04: "LOCAL SESSION" badge is visible in the header', () => {
    renderHeaderWithGuestSession();
    expect(screen.getByText(/local session/i)).toBeInTheDocument();
  });

  // TC-05: All features accessible in guest mode
  it('TC-05: navigating to analysis, results, and settings routes is not blocked', async () => {
    const routes = ['/analysis/new', '/settings', '/chat'];
    for (const route of routes) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>,
      );
      // Should not redirect to /sign-in
      await waitFor(() => {
        expect(screen.queryByText(/sign in with adobe ims/i)).toBeNull();
      });
      unmount();
    }
  });

  // TC-06: Works fully offline (no network calls on session init)
  it('TC-06: session initializes without any network fetch calls', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    renderApp('/');
    await waitFor(() => {
      expect(window.api.storeGet).toHaveBeenCalled();
    });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
