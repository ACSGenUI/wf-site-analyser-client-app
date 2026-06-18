import { create } from 'zustand';

export interface SessionProfile {
  name: string;
  email: string;
  org: string;
}

export interface SessionState {
  mode: 'guest' | 'authenticated';
  userId: string | null;
  createdAt: Date | null;
  syncStatus: 'synced' | 'syncing' | 'offline' | null;
  profile: SessionProfile | null;
}

export const useSessionStore = create<SessionState>(() => ({
  mode: 'guest',
  userId: null,
  createdAt: null,
  syncStatus: null,
  profile: null,
}));
