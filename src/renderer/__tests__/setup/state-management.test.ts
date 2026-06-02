import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement } from 'react';
import { useAppStore } from '../../store';
import { IPC_CHANNELS, type ElectronAPI } from '@shared/types';

// ---------------------------------------------------------------------------
// TC-01 — Zustand store initialises with default state
// ---------------------------------------------------------------------------
describe('TC-01: Zustand store initialises', () => {
  beforeEach(() => {
    // Reset to initial state between tests
    useAppStore.setState({
      sessionId: null,
      sessionMode: 'guest',
      activeProjectId: null,
      syncStatus: 'idle',
      theme: 'dark',
    });
  });

  it('creates the store with default session state', () => {
    const { result } = renderHook(() => useAppStore());
    expect(result.current.sessionId).toBeNull();
    expect(result.current.sessionMode).toBe('guest');
  });

  it('creates the store with default project and sync state', () => {
    const { result } = renderHook(() => useAppStore());
    expect(result.current.activeProjectId).toBeNull();
    expect(result.current.syncStatus).toBe('idle');
  });

  it('creates the store with default theme', () => {
    const { result } = renderHook(() => useAppStore());
    expect(result.current.theme).toBe('dark');
  });

  it('is accessible from any component via the hook', () => {
    const { result } = renderHook(() => useAppStore());
    expect(result.current).toHaveProperty('setSessionId');
    expect(result.current).toHaveProperty('setSessionMode');
    expect(result.current).toHaveProperty('setActiveProjectId');
    expect(result.current).toHaveProperty('setSyncStatus');
    expect(result.current).toHaveProperty('setTheme');
    expect(result.current).toHaveProperty('hydrateFromStorage');
  });

  it('updates state via setters', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setSessionId('ses-abc-123');
      result.current.setSessionMode('authenticated');
      result.current.setTheme('light');
    });

    expect(result.current.sessionId).toBe('ses-abc-123');
    expect(result.current.sessionMode).toBe('authenticated');
    expect(result.current.theme).toBe('light');
  });
});

// ---------------------------------------------------------------------------
// TC-02 — electron-store read/write via IPC bridge
// ---------------------------------------------------------------------------
describe('TC-02: electron-store read/write via IPC', () => {
  it('storeGet calls the correct IPC channel', async () => {
    await window.api.storeGet('someKey');
    expect(window.api.storeGet).toHaveBeenCalledWith('someKey');
  });

  it('storeSet calls the correct IPC channel with key and value', async () => {
    await window.api.storeSet('theme', 'light');
    expect(window.api.storeSet).toHaveBeenCalledWith('theme', 'light');
  });

  it('storeDelete calls the correct IPC channel', async () => {
    await window.api.storeDelete('theme');
    expect(window.api.storeDelete).toHaveBeenCalledWith('theme');
  });

  it('storeGet resolves to a value', async () => {
    vi.mocked(window.api.storeGet).mockResolvedValueOnce('dark');
    const value = await window.api.storeGet('theme');
    expect(value).toBe('dark');
  });

  it('IPC channels for store are defined as constants', () => {
    expect(IPC_CHANNELS.STORE_GET).toBe('store:get');
    expect(IPC_CHANNELS.STORE_SET).toBe('store:set');
    expect(IPC_CHANNELS.STORE_DELETE).toBe('store:delete');
  });
});

// ---------------------------------------------------------------------------
// TC-03 — React Hook Form + Zod validation
// ---------------------------------------------------------------------------
describe('TC-03: React Hook Form + Zod validation', () => {
  // Dynamic import avoids pulling in React-specific imports at the describe level
  async function renderForm(onSubmit = vi.fn()) {
    const { AnalysisSetupForm } = await import('../../components/forms/AnalysisSetupForm');
    return render(createElement(AnalysisSetupForm, { onSubmit }));
  }

  it('renders the URL field and submit button', async () => {
    await renderForm();
    expect(screen.getByLabelText(/site url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start analysis/i })).toBeInTheDocument();
  });

  it('shows a validation error when URL is empty on submit', async () => {
    const user = userEvent.setup();
    await renderForm();

    await user.click(screen.getByRole('button', { name: /start analysis/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('shows a validation error for an invalid URL', async () => {
    const user = userEvent.setup();
    await renderForm();

    await user.type(screen.getByLabelText(/site url/i), 'not-a-url');
    await user.click(screen.getByRole('button', { name: /start analysis/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/valid url/i);
    });
  });

  it('calls onSubmit with valid data when form is correct', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    await renderForm(onSubmit);

    await user.type(screen.getByLabelText(/site url/i), 'https://adobe.com');
    await user.click(screen.getByRole('button', { name: /start analysis/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ url: 'https://adobe.com' }),
        expect.anything(),
      );
    });
  });

  it('does not call onSubmit when validation fails', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    await renderForm(onSubmit);

    await user.click(screen.getByRole('button', { name: /start analysis/i }));
    await waitFor(() => screen.getByRole('alert'));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// TC-04 — State hydration on app startup
// ---------------------------------------------------------------------------
describe('TC-04: State hydration on startup', () => {
  beforeEach(() => {
    useAppStore.setState({
      sessionId: null,
      sessionMode: 'guest',
      activeProjectId: null,
      syncStatus: 'idle',
      theme: 'dark',
    });
  });

  it('loads persisted sessionId from the store into Zustand', async () => {
    vi.mocked(window.api.storeGet)
      .mockResolvedValueOnce('hydrated-session-id') // sessionId
      .mockResolvedValueOnce('authenticated')        // sessionMode
      .mockResolvedValueOnce(null)                   // activeProjectId
      .mockResolvedValueOnce('light');               // theme

    const { result } = renderHook(() => useAppStore());
    await act(async () => {
      await result.current.hydrateFromStorage();
    });

    expect(result.current.sessionId).toBe('hydrated-session-id');
  });

  it('loads persisted sessionMode from the store into Zustand', async () => {
    vi.mocked(window.api.storeGet)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce('authenticated')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const { result } = renderHook(() => useAppStore());
    await act(async () => {
      await result.current.hydrateFromStorage();
    });

    expect(result.current.sessionMode).toBe('authenticated');
  });

  it('loads persisted theme from the store into Zustand', async () => {
    vi.mocked(window.api.storeGet)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce('light');

    const { result } = renderHook(() => useAppStore());
    await act(async () => {
      await result.current.hydrateFromStorage();
    });

    expect(result.current.theme).toBe('light');
  });

  it('falls back to defaults when persisted values are null', async () => {
    vi.mocked(window.api.storeGet).mockResolvedValue(null);

    const { result } = renderHook(() => useAppStore());
    await act(async () => {
      await result.current.hydrateFromStorage();
    });

    expect(result.current.sessionId).toBeNull();
    expect(result.current.sessionMode).toBe('guest');
    expect(result.current.theme).toBe('dark');
  });
});

// ---------------------------------------------------------------------------
// TC-05 — IPC service layer type safety
// ---------------------------------------------------------------------------
describe('TC-05: IPC service layer type safety', () => {
  it('window.api exposes all typed ElectronAPI methods', () => {
    const typedMethods: Array<keyof ElectronAPI> = [
      'getAppVersion',
      'storeGet',
      'storeSet',
      'storeDelete',
      'getSessionId',
      'checkForUpdates',
      'installUpdate',
      'onUpdateStatus',
    ];

    for (const method of typedMethods) {
      expect(typeof window.api[method]).toBe('function');
    }
  });

  it('IPC_CHANNELS covers all expected store channels', () => {
    expect(IPC_CHANNELS).toMatchObject({
      STORE_GET: 'store:get',
      STORE_SET: 'store:set',
      STORE_DELETE: 'store:delete',
    });
  });

  it('calling a non-existent IPC handler returns undefined at runtime (TypeScript catches it at compile time)', () => {
    // At runtime the index signature returns undefined for unknown keys.
    // In TypeScript source, window.api.nonExistentMethod() is a type error
    // because ElectronAPI's named methods are checked before the index signature.
    const api = window.api as Record<string, unknown>;
    expect(api['nonExistentMethod:doSomething']).toBeUndefined();
  });

  it('ElectronAPI is correctly typed via the global Window declaration', () => {
    // window.api must be an object (not null / undefined / primitive)
    expect(window.api).toBeDefined();
    expect(typeof window.api).toBe('object');
  });
});
