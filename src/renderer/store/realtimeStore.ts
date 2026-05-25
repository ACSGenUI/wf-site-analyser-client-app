import { create } from 'zustand';

export interface ProgressEvent {
  analysisId: string;
  progress: number;
  stage: string;
  pagesFound?: number;
}

interface RealtimeState {
  latestProgress: ProgressEvent | null;
  connected: boolean;

  setProgress: (event: ProgressEvent) => void;
  setConnected: (connected: boolean) => void;
  reset: () => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  latestProgress: null,
  connected: false,

  setProgress: (event) => set({ latestProgress: event }),
  setConnected: (connected) => set({ connected }),
  reset: () => set({ latestProgress: null, connected: false }),
}));

/**
 * Subscribes to analysis:progress events proxied from main → renderer via IPC.
 * Returns a cleanup function that removes the listener.
 * This is a stub; Epic 05 will replace with the full implementation.
 */
export function subscribeToAnalysisProgress(
  onProgress: (event: ProgressEvent) => void,
): () => void {
  if (typeof window === 'undefined' || !window.api) return () => {};

  // The IPC subscription pattern mirrors Electron's ipcRenderer.on
  const cleanup = window.api.onUpdateStatus((status: string) => {
    try {
      const parsed = JSON.parse(status) as ProgressEvent;
      onProgress(parsed);
    } catch {
      // non-JSON status messages are ignored here
    }
  });

  return typeof cleanup === 'function' ? cleanup : () => {};
}
