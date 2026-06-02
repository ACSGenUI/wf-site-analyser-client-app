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

// 30-min poll (SA-202 AC-7); exponential backoff with ±20% jitter on failures (cap 6h) to avoid thundering-herd retries.
const BASE_POLL_INTERVAL_MS = 30 * 60 * 1000;
const MAX_POLL_INTERVAL_MS = 6 * 60 * 60 * 1000;
const BACKOFF_JITTER_RATIO = 0.2;

/** Next poll delay: base on success, else `base * 2^failures` (capped at MAX_POLL_INTERVAL_MS) with ±20% jitter. */
function backoffDelay(failures: number): number {
  if (failures <= 0) return BASE_POLL_INTERVAL_MS;
  const exponential = BASE_POLL_INTERVAL_MS * 2 ** failures;
  const capped = Math.min(exponential, MAX_POLL_INTERVAL_MS);
  const jitter = capped * BACKOFF_JITTER_RATIO * (Math.random() * 2 - 1);
  return Math.max(1000, Math.round(capped + jitter));
}

/** True if `current` < `minimum` per semver; false on invalid input so a bad server response can't force the modal. */
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

/** Map raw main-process `update-status` strings onto our 5-state enum; returns null for unknown values. */
function normalizeStatus(raw: string): ForceUpdateStatus | null {
  const s = raw.trim().toLowerCase();
  if ((KNOWN_STATUSES as readonly string[]).includes(s)) {
    return s as ForceUpdateStatus;
  }
  if (s === 'download-progress' || s === 'downloading-update') return 'downloading';
  if (s === 'update-downloaded') return 'ready';
  return null;
}

// Don't show "Checking…" if the check finishes in under this many ms — prevents a UI flash.
const CHECKING_REVEAL_DELAY_MS = 200;

export function VersionChecker(): ReactElement | null {
  const [checkState, setCheckState] = useState<CheckState>({ kind: 'idle' });
  const [currentVersion, setCurrentVersion] = useState('');
  const [installStatus, setInstallStatus] = useState<ForceUpdateStatus>('ready');
  const [downloadProgress, setDownloadProgress] = useState<number | undefined>(undefined);
  const [showCheckingIndicator, setShowCheckingIndicator] = useState(false);

  // Once mandatory is set, lock it — later polls must never unmount the modal mid-install.
  const mandatoryLockedRef = useRef(false);

  // Initial check on mount + self-rescheduling timer (base interval on success, backoff on failure).
  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let failures = 0;

    // Resolve local version once; never rejects (errors → '') so runCheck can await it deterministically.
    const localVersionPromise = window.api
      .getAppVersion()
      .then((v) => v)
      .catch(() => '');

    // Fall back to local version; server-echoed currentVersion (set in runCheck) takes precedence via `prev || v`.
    void localVersionPromise.then((v) => {
      if (!cancelled && v) setCurrentVersion((prev) => prev || v);
    });

    const scheduleNext = (delayMs: number) => {
      if (cancelled || mandatoryLockedRef.current) return;
      timeoutId = setTimeout(runCheck, delayMs);
    };

    const runCheck = () => {
      // Wait for both so the minimumVersion gate always has a currentVersion to compare against.
      Promise.all([window.api.checkForUpdates(), localVersionPromise])
        .then(([result, localVersion]) => {
          if (cancelled || mandatoryLockedRef.current) return;
          // Network resolved (live or cached) → reset backoff counter.
          failures = 0;

          let lockedThisRun = false;

          if (!result.updateAvailable) {
            setCheckState({ kind: 'upToDate' });
          } else {
            const newVersion = result.latestVersion ?? result.version;
            if (!newVersion) {
              console.error(
                'Version check returned updateAvailable=true but no latestVersion/version field',
              );
              setCheckState({ kind: 'failed' });
            } else {
              // Server-echoed `currentVersion` is authoritative; fall back to locally-resolved version.
              const serverCurrentVersion = result.currentVersion ?? localVersion;
              if (serverCurrentVersion) setCurrentVersion(serverCurrentVersion);

              // Below server's `minimumVersion` → treat as mandatory even if `mandatory` flag is false.
              const isBelowMinimum =
                result.minimumVersion && serverCurrentVersion
                  ? isBelowMinimumVersion(serverCurrentVersion, result.minimumVersion)
                  : false;

              if (result.mandatory || isBelowMinimum) {
                mandatoryLockedRef.current = true;
                lockedThisRun = true;
                setCheckState({
                  kind: 'mandatory',
                  newVersion,
                  releaseNotes: result.releaseNotes ?? [],
                  estimatedSeconds: result.estimatedUpdateSeconds,
                });
              } else {
                setCheckState({ kind: 'optional', newVersion });
              }
            }
          }

          // Don't poll further once the blocking modal is committed.
          if (!lockedThisRun) scheduleNext(BASE_POLL_INTERVAL_MS);
        })
        .catch((err: unknown) => {
          if (cancelled || mandatoryLockedRef.current) return;
          failures += 1;
          console.error(`Version check failed (attempt ${failures}):`, err);
          setCheckState({ kind: 'failed' });
          scheduleNext(backoffDelay(failures));
        });
    };

    runCheck();

    return () => {
      cancelled = true;
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, []);

  // Reveal "Checking…" only after the delay threshold to prevent UI flash on fast checks.
  useEffect(() => {
    const id = setTimeout(() => setShowCheckingIndicator(true), CHECKING_REVEAL_DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  // Subscribe to install events so the modal transitions through download → install → restart (and error).
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
    // Flip to 'downloading' so the button disables now; main process drives later transitions via onUpdateStatus.
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

  // 'idle' — initial check in flight; subtle delayed-reveal indicator (see CHECKING_REVEAL_DELAY_MS).
  if (checkState.kind === 'idle' && showCheckingIndicator) {
    return (
      <aside
        role="status"
        aria-live="polite"
        className="fixed right-4 top-4 z-30 flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm"
      >
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2 animate-pulse rounded-full bg-neutral-400"
        />
        Checking for updates…
      </aside>
    );
  }

  return null;
}
