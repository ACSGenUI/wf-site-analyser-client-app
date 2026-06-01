/**
 * SA-202: Version Check on Launch
 *
 * Tests that the app silently checks for updates on launch, surfaces the
 * blocking force-update modal for mandatory updates, and gracefully handles
 * version-check failures.
 *
 * Test File: src/renderer/__tests__/lifecycle/VersionCheckOnLaunch.test.tsx
 */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { VersionChecker } from '@/components/VersionChecker';

// VersionChecker is a "behaviour" component — it renders nothing when up-to-date
// and renders the ForceUpdateModal when a mandatory update is detected.

function renderVersionChecker(overrides: { updateAvailable?: boolean; mandatory?: boolean } = {}) {
  vi.mocked(window.api.checkForUpdates).mockResolvedValue({
    updateAvailable: overrides.updateAvailable ?? false,
    mandatory: overrides.mandatory ?? false,
    version: overrides.updateAvailable ? '2.5.0' : undefined,
  });
  return render(<VersionChecker />);
}

describe('SA-202 – Version Check on Launch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC-01: Version check runs on mount
  it('TC-01: calls checkForUpdates IPC on component mount', async () => {
    renderVersionChecker();
    await waitFor(() => {
      expect(window.api.checkForUpdates).toHaveBeenCalledTimes(1);
    });
  });

  // TC-02: No UI shown when up-to-date
  it('TC-02: renders nothing when app is up-to-date', async () => {
    const { container } = renderVersionChecker({ updateAvailable: false });
    await waitFor(() => expect(window.api.checkForUpdates).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  // TC-03: Blocking modal shown for mandatory update
  it('TC-03: renders ForceUpdateModal when a mandatory update is detected', async () => {
    renderVersionChecker({ updateAvailable: true, mandatory: true });
    await waitFor(() => {
      expect(screen.getByText(/update required/i)).toBeInTheDocument();
    });
  });

  // TC-04: Non-mandatory update shows optional banner
  it('TC-04: renders an optional update notification for non-mandatory updates', async () => {
    renderVersionChecker({ updateAvailable: true, mandatory: false });
    await waitFor(() => {
      expect(screen.getByText(/update available/i)).toBeInTheDocument();
    });
    // Should NOT show the blocking modal
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  // TC-05: Graceful handling of network errors
  it('TC-05: handles version check network failure gracefully without crashing', async () => {
    vi.mocked(window.api.checkForUpdates).mockRejectedValue(new Error('Network error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<VersionChecker />);
    await waitFor(() => expect(window.api.checkForUpdates).toHaveBeenCalled());
    // App should not crash — container renders without throwing
    expect(container).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
