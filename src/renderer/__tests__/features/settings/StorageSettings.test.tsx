/**
 * SA-904: Storage & Persistence Settings
 *
 * Tests the storage settings tab: retention dropdown options, warning banner,
 * storage usage display, and Clear Data confirmation flow.
 *
 * Test File: src/renderer/__tests__/features/settings/StorageSettings.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StorageSettings } from '@/features/settings/StorageSettings';

function renderStorage() {
  vi.mocked(window.api['data:getStorageUsage']).mockResolvedValue({
    usedBytes: 2468987289,   // ~2.3 GB
    totalBytes: 10737418240, // 10 GB
  });
  return render(<StorageSettings />);
}

describe('SA-904 – Storage & Persistence Settings', () => {
  // TC-01: Retention dropdown options
  it('TC-01: retention dropdown contains 7 Days, 14 Days, 30 Days, 90 Days, Unlimited', async () => {
    renderStorage();
    const dropdown = screen.getByRole('combobox', { name: /data persistence|retention/i });
    await userEvent.click(dropdown);
    expect(screen.getByRole('option', { name: /7 days?/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /14 days?/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /30 days?|standard/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /90 days?/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /unlimited/i })).toBeInTheDocument();
  });

  // TC-02: Warning banner renders with amber border
  it('TC-02: warning banner has border-l-4 and border-amber-500 classes', () => {
    renderStorage();
    const banner = screen.getByTestId('warning-banner');
    expect(banner.className).toMatch(/border-l-4/);
    expect(banner.className).toMatch(/border-amber-500/);
  });

  // TC-03: Storage usage is displayed
  it('TC-03: displays current storage usage in human-readable format', async () => {
    renderStorage();
    await waitFor(() => {
      expect(screen.getByText(/2\.3 gb|2,300 mb/i)).toBeInTheDocument();
      expect(screen.getByText(/10 gb/i)).toBeInTheDocument();
    });
  });

  // TC-04: Clear Data shows confirmation dialog
  it('TC-04: clicking "Clear Data" opens a confirmation dialog', async () => {
    renderStorage();
    await userEvent.click(screen.getByRole('button', { name: /clear data/i }));
    expect(
      screen.getByRole('dialog') ?? screen.getByRole('alertdialog'),
    ).toBeInTheDocument();
    expect(screen.getByText(/are you sure|this action cannot/i)).toBeInTheDocument();
  });

  // TC-05: Confirming deletion triggers IPC
  it('TC-05: confirming the Clear Data dialog calls data:clearOldData IPC handler', async () => {
    renderStorage();
    await userEvent.click(screen.getByRole('button', { name: /clear data/i }));
    await userEvent.click(screen.getByRole('button', { name: /confirm|yes, delete/i }));
    expect(window.api['data:clearOldData']).toHaveBeenCalled();
  });

  // TC-06: Default retention is 30 Days
  it('TC-06: "30 Days" is the selected option by default', () => {
    renderStorage();
    const dropdown = screen.getByRole('combobox', { name: /data persistence|retention/i });
    expect(dropdown).toHaveValue(expect.stringMatching(/30|standard/i));
  });
});
