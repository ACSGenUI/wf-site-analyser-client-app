import { create } from 'zustand';

type SessionMode = 'guest' | 'authenticated';
type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';
type Theme = 'dark' | 'light' | 'system';

interface AppState {
  sessionId: string | null;
  sessionMode: SessionMode;
  activeProjectId: string | null;
  syncStatus: SyncStatus;
  theme: Theme;

  setSessionId: (id: string | null) => void;
  setSessionMode: (mode: SessionMode) => void;
  setActiveProjectId: (id: string | null) => void;
  setSyncStatus: (status: SyncStatus) => void;
  setTheme: (theme: Theme) => void;
  hydrateFromStorage: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  sessionId: null,
  sessionMode: 'guest',
  activeProjectId: null,
  syncStatus: 'idle',
  theme: 'dark',

  setSessionId: (id) => set({ sessionId: id }),
  setSessionMode: (mode) => set({ sessionMode: mode }),
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setSyncStatus: (status) => set({ syncStatus: status }),
  setTheme: (theme) => set({ theme }),

  hydrateFromStorage: async () => {
    if (typeof window === 'undefined' || !window.api) return;

    const [sessionId, sessionMode, activeProjectId, theme] = await Promise.all([
      window.api.storeGet('sessionId'),
      window.api.storeGet('sessionMode'),
      window.api.storeGet('activeProjectId'),
      window.api.storeGet('theme'),
    ]);

    set({
      sessionId: (sessionId as string) ?? null,
      sessionMode: (sessionMode as SessionMode) ?? 'guest',
      activeProjectId: (activeProjectId as string) ?? null,
      theme: (theme as Theme) ?? 'dark',
    });
  },
}));
