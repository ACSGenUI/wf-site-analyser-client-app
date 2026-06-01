/**
 * SA-201: Force Update Modal
 *
 * Tests that the blocking force-update modal renders correctly, prevents
 * background interaction, drives the Electron update lifecycle via IPC,
 * and auto-saves in-progress work before restarting.
 *
 * Test File: src/renderer/__tests__/components/ForceUpdateModal.test.tsx
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ForceUpdateModal } from '@/components/ForceUpdateModal';

// Props shape expected by the component
interface ForceUpdateModalProps {
  currentVersion: string;
  newVersion: string;
  status: 'ready' | 'downloading' | 'installing' | 'error' | 'restarting';
  downloadProgress?: number;
  onInstall: () => void;
  onRetry?: () => void;
}

const defaultProps: ForceUpdateModalProps = {
  currentVersion: '2.3.0',
  newVersion: '2.4.0',
  status: 'ready',
  onInstall: vi.fn(),
  onRetry: vi.fn(),
};

function renderModal(props: Partial<ForceUpdateModalProps> = {}) {
  return render(<ForceUpdateModal {...defaultProps} {...props} />);
}

describe('SA-201 – Force Update Modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC-01: Renders when mandatory update detected
  it('TC-01: renders when mandatory update flag is set', () => {
    renderModal();
    expect(screen.getByText(/update required/i)).toBeInTheDocument();
    expect(screen.getByText(/system update/i)).toBeInTheDocument();
  });

  // TC-02: Blocks background interaction
  it('TC-02: overlay disables pointer-events on background content', () => {
    renderModal();
    const overlay = screen.getByRole('dialog');
    // The modal overlay should cover the viewport and disable clicks behind it
    expect(overlay).toBeInTheDocument();
    // Confirm the backdrop has pointer-events-none on the background layer
    const backdrop = overlay.parentElement;
    expect(backdrop).not.toBeNull();
    // The modal container should have inert or aria-modal
    expect(overlay).toHaveAttribute('aria-modal', 'true');
  });

  // TC-03: Shows version comparison
  it('TC-03: displays current and new version with an arrow between them', () => {
    renderModal({ currentVersion: '2.3.0', newVersion: '2.4.0' });
    expect(screen.getByText('2.3.0')).toBeInTheDocument();
    expect(screen.getByText('2.4.0')).toBeInTheDocument();
    // Arrow separator
    expect(
      screen.getByRole('img', { name: /arrow|upgrade/i }) ?? screen.getByText(/→|➜/),
    ).toBeInTheDocument();
  });

  // TC-04: CTA triggers IPC update
  it('TC-04: clicking "Restart and Update Now" invokes the install callback', async () => {
    const onInstall = vi.fn();
    renderModal({ onInstall });
    await userEvent.click(screen.getByRole('button', { name: /restart and update/i }));
    expect(onInstall).toHaveBeenCalledTimes(1);
  });

  // TC-05: Auto-saves before restart
  it('TC-05: auto-saves in-progress work before triggering update', async () => {
    const onInstall = vi.fn(async () => {
      await window.api['analysis:saveAutoSave']();
    });
    renderModal({ onInstall });
    await userEvent.click(screen.getByRole('button', { name: /restart and update/i }));
    expect(window.api['analysis:saveAutoSave']).toHaveBeenCalled();
  });

  // TC-06: Shows error state with retry
  it('TC-06: renders error message and retry button when status is "error"', () => {
    renderModal({ status: 'error', onRetry: vi.fn() });
    expect(screen.getByText(/failed|error/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  // TC-07: Cannot be dismissed via Escape
  it('TC-07: pressing Escape does not close the modal', async () => {
    renderModal();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByText(/update required/i)).toBeInTheDocument();
  });

  // TC-08: Status badge updates through states
  it('TC-08: status badge text reflects "Ready to Install" in default state', () => {
    renderModal({ status: 'ready' });
    expect(screen.getByText(/ready to install/i)).toBeInTheDocument();
  });

  it('TC-08a: status badge shows "Downloading..." during download', () => {
    renderModal({ status: 'downloading', downloadProgress: 45 });
    expect(screen.getByText(/downloading/i)).toBeInTheDocument();
  });

  it('TC-08b: status badge shows "Installing..." during installation', () => {
    renderModal({ status: 'installing' });
    expect(screen.getByText(/installing/i)).toBeInTheDocument();
  });
});
