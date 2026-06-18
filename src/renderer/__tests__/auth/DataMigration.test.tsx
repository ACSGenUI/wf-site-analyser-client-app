/**
 * SA-1004: Guest-to-Authenticated Data Migration
 *
 * Tests the data migration dialog: detection of local guest data, merge/discard/
 * keep-separate flows via IPC, progress indicator, error handling, and cleanup.
 *
 * Test File: src/renderer/__tests__/auth/DataMigration.test.tsx
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { DataMigrationDialog } from '@/features/auth/DataMigrationDialog';

function renderDialog(hasGuestData = true) {
  return render(
    <DataMigrationDialog
      isOpen={hasGuestData}
      guestUserId="guest-uuid-1234"
      authenticatedUserId="ims-user-001"
      onComplete={vi.fn()}
    />,
  );
}

describe('SA-1004 – Guest-to-Authenticated Data Migration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC-01: Migration dialog shown when local data exists
  it('TC-01: dialog is rendered when local guest data is detected', () => {
    renderDialog(true);
    expect(screen.getByText(/found local data|guest session/i)).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // TC-02: Merge uploads local data via IPC
  it('TC-02: clicking "Merge" invokes data:migrateGuestToAuth IPC call', async () => {
    renderDialog();
    await userEvent.click(screen.getByRole('button', { name: /merge|merge with cloud/i }));
    await waitFor(() => {
      expect(window.api['data:migrateGuestToAuth']).toHaveBeenCalledWith(
        expect.objectContaining({ guestUserId: 'guest-uuid-1234', authUserId: 'ims-user-001' }),
      );
    });
  });

  // TC-03: Discard requires confirmation and deletes
  it('TC-03: clicking "Discard" then confirming invokes data:discardGuestData IPC', async () => {
    renderDialog();
    await userEvent.click(screen.getByRole('button', { name: /discard|discard local/i }));
    // Confirmation dialog
    await userEvent.click(screen.getByRole('button', { name: /confirm|yes, discard/i }));
    await waitFor(() => {
      expect(window.api['data:discardGuestData']).toHaveBeenCalledWith('guest-uuid-1234');
    });
  });

  // TC-04: Keep Separate does not invoke upload or delete
  it('TC-04: clicking "Keep Separate" does NOT call migrate or discard IPC', async () => {
    renderDialog();
    await userEvent.click(screen.getByRole('button', { name: /keep separate/i }));
    expect(window.api['data:migrateGuestToAuth']).not.toHaveBeenCalled();
    expect(window.api['data:discardGuestData']).not.toHaveBeenCalled();
  });

  // TC-05: Progress indicator shown during merge
  it('TC-05: progress bar with bg-blue-600 class appears while merge is running', async () => {
    vi.mocked(window.api['data:migrateGuestToAuth']).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 2000)),
    );
    renderDialog();
    await userEvent.click(screen.getByRole('button', { name: /merge/i }));
    const progressBar = screen.getByRole('progressbar') ?? screen.getByTestId('migration-progress');
    expect(progressBar.className).toMatch(/bg-blue-600/);
  });

  // TC-06: Migration error shows retry
  it('TC-06: migration failure renders an error message with a retry button', async () => {
    vi.mocked(window.api['data:migrateGuestToAuth']).mockRejectedValue(
      new Error('Migration failed'),
    );
    renderDialog();
    await userEvent.click(screen.getByRole('button', { name: /merge/i }));
    await waitFor(() => {
      expect(screen.getByText(/failed|error/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  // TC-07: Dialog not shown when no guest data exists
  it('TC-07: dialog is not rendered when hasGuestData is false', () => {
    renderDialog(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
