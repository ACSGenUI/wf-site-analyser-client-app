import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { lt as semverLt, valid as semverValid } from 'semver';

import type { ReleaseNote } from '@shared/types';

import { ForceUpdateModal, type ForceUpdateStatus } from './ForceUpdateModal';

type CheckState =
  | { kind: 'idle' }
  | { kind: 'upToDate' }
  | { kind: 'optional'; newVersion: string }
  | {
      kind: 'mandatory';
      newVersion: string;
      releaseNotes: ReleaseNote[];
      estimatedSeconds?: number;
    }
  | { kind: 'failed' };

const POLL_INTERVAL_MS = 30 * 60 * 1000;

/**
 * Returns true iff `current` is strictly below `minimum` per semver.
 * Returns false for any invalid input so a malformed version string from the
 * server doesn't force users into the blocking modal.
 */
function isBelowMinimumVersion(current: string, minimum: string): boolean {
  if (!semverValid(current) || !semverValid(minimum)) return false;
  return semverLt(current, minimum);
}

const KNOWN_STATUSES: readonly ForceUpdateStatus[] = [
  'ready',
  'downloading',
  'installing',
  'error',
  'restarting',
];

/**
 * Map the loosely-typed string the main process sends over `update-status` onto our
 * five-state enum. Accepts the published enum names as well as a couple of common
 * electron-updater event names so the renderer stays tolerant of small variations.
 * Returns null for unknown values so callers can ignore them.
 */
function normalizeStatus(raw: string): ForceUpdateStatus | null {
  const s = raw.trim().toLowerCase();
  if ((KNOWN_STATUSES as readonly string[]).includes(s)) {
    return s as ForceUpdateStatus;
  }
  if (s === 'download-progress' || s === 'downloading-update') return 'downloading';
  if (s === 'update-downloaded') return 'ready';
  return null;
}

export function VersionChecker(): ReactElement | null {
  const [checkState, setCheckState] = useState<CheckState>({ kind: 'idle' });
  const [currentVersion, setCurrentVersion] = useState('');
  const [installStatus, setInstallStatus] = useState<ForceUpdateStatus>('ready');
  const [downloadProgress, setDownloadProgress] = useState<number | undefined>(undefined);

  // Once a mandatory update is surfaced, the blocking modal must stay up for the
  // rest of the session — a later background poll returning updateAvailable=false
  // (or any non-mandatory result) must never unmount it mid-install. This ref locks
  // the state and is read inside the async poll callback without re-subscribing.
  const mandatoryLockedRef = useRef(false);

  // Version check on mount and every 30 minutes thereafter.
  useEffect(() => {
    let cancelled = false;

    // Resolve the local running version exactly once. It never rejects (errors map
    // to '') so it can be awaited inside runCheck as the deterministic fallback for
    // the minimumVersion comparison, regardless of which IPC call resolves first.
    const localVersionPromise = window.api
      .getAppVersion()
      .then((v) => v)
      .catch(() => '');

    // Fill currentVersion from the local value as a fallback. The `prev || v` guard
    // keeps a server-echoed currentVersion (set in runCheck) authoritative when present.
    void localVersionPromise.then((v) => {
      if (!cancelled && v) setCurrentVersion((prev) => prev || v);
    });

    const runCheck = () => {
      // Await both the update check and the (cached) local version before deciding,
      // so serverCurrentVersion always has a fallback and the minimumVersion gate is
      // never silently skipped due to promise resolution order.
      Promise.all([window.api.checkForUpdates(), localVersionPromise])
        .then(([result, localVersion]) => {
          if (cancelled || mandatoryLockedRef.current) return;

          if (!result.updateAvailable) {
            setCheckState({ kind: 'upToDate' });
            return;
          }

          const newVersion = result.latestVersion ?? result.version;
          if (!newVersion) {
            console.error(
              'Version check returned updateAvailable=true but no latestVersion/version field',
            );
            setCheckState({ kind: 'failed' });
            return;
          }

          // The server may echo the running version in `currentVersion` — when present
          // it is authoritative (the server knows what we sent it). The local version
          // resolved above fills the field otherwise.
          const serverCurrentVersion = result.currentVersion ?? localVersion;
          if (serverCurrentVersion) setCurrentVersion(serverCurrentVersion);

          // Enforce minimumVersion independently of the mandatory flag: if the running
          // version is below the server-defined floor, treat it as mandatory even when
          // the server didn't explicitly set mandatory:true.
          const isBelowMinimum =
            result.minimumVersion && serverCurrentVersion
              ? isBelowMinimumVersion(serverCurrentVersion, result.minimumVersion)
              : false;

          if (result.mandatory || isBelowMinimum) {
            mandatoryLockedRef.current = true;
            // No further polling needed once the blocking modal is committed.
            clearInterval(intervalId);
            setCheckState({
              kind: 'mandatory',
              newVersion,
              releaseNotes: result.releaseNotes ?? [],
              estimatedSeconds: result.estimatedUpdateSeconds,
            });
          } else {
            setCheckState({ kind: 'optional', newVersion });
          }
        })
        .catch((err: unknown) => {
          if (cancelled || mandatoryLockedRef.current) return;
          console.error('Version check failed:', err);
          setCheckState({ kind: 'failed' });
        });
    };

    runCheck();

    const intervalId = setInterval(runCheck, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  // Subscribe to install lifecycle events from the main process so the modal
  // can transition through downloading → installing → restarting (and error).
  useEffect(() => {
    const unsubStatus = window.api.onUpdateStatus?.((raw) => {
      const next = normalizeStatus(raw);
      if (next) setInstallStatus(next);
    });
    const unsubProgress = window.api.onUpdateProgress?.((percent) => {
      setDownloadProgress(Math.max(0, Math.min(100, Math.round(percent))));
    });
    return () => {
      unsubStatus?.();
      unsubProgress?.();
    };
  }, []);

  const handleInstall = useCallback(async () => {
    // Optimistically flip to 'downloading' so the button disables immediately;
    // the main process will drive subsequent transitions via onUpdateStatus.
    setInstallStatus('downloading');
    try {
      await window.api['analysis:saveAutoSave']();
    } catch {
      // Auto-save is best-effort — never block the update on it.
    }
    try {
      await window.api.installUpdate();
    } catch (err) {
      console.error('Install update failed:', err);
      setInstallStatus('error');
    }
  }, []);

  const handleRetry = useCallback(() => {
    void handleInstall();
  }, [handleInstall]);

  if (checkState.kind === 'mandatory') {
    return (
      <ForceUpdateModal
        currentVersion={currentVersion}
        newVersion={checkState.newVersion}
        status={installStatus}
        downloadProgress={downloadProgress}
        releaseNotes={checkState.releaseNotes}
        estimatedSeconds={checkState.estimatedSeconds}
        onInstall={handleInstall}
        onRetry={handleRetry}
      />
    );
  }

  if (checkState.kind === 'optional') {
    return (
      <aside
        role="status"
        className="fixed right-4 top-4 z-30 flex items-center gap-2 rounded-md border border-primary-100 bg-primary-50 px-3 py-2 text-sm text-primary-dark shadow-sm"
      >
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-primary" />
        Update available — version {checkState.newVersion}
      </aside>
    );
  }

  if (checkState.kind === 'failed') {
    return (
      <aside
        role="alert"
        className="fixed right-4 top-4 z-30 flex items-center gap-2 rounded-md border border-warning/40 bg-warning-surface px-3 py-2 text-sm text-warning-dark shadow-sm"
      >
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-warning" />
        Unable to check for updates. Proceeding without verification.
      </aside>
    );
  }

  return null;
}
