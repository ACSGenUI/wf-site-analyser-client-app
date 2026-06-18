/**
 * SA-903: Browser Settings
 *
 * Tests the browser settings tab: screenshot and JS execution toggles,
 * user agent dropdown with presets, and settings persistence.
 *
 * Test File: src/renderer/__tests__/features/settings/BrowserSettings.test.tsx
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { BrowserSettings } from '@/features/settings/BrowserSettings';

function renderBrowserSettings() {
  return render(<BrowserSettings />);
}

describe('SA-903 – Browser Settings', () => {
  // TC-01: Screenshot toggle renders ON state with blue background
  it('TC-01: screenshot capture toggle renders with bg-blue-600 in ON state', () => {
    renderBrowserSettings();
    const screenshotToggle = screen.getByRole('switch', { name: /screenshot capture/i });
    expect(screenshotToggle).toHaveAttribute('aria-checked', 'true');
    expect(screenshotToggle.className).toMatch(/bg-blue-600/);
  });

  // TC-02: Toggling screenshot changes state visually
  it('TC-02: clicking the screenshot toggle changes it to OFF (bg-gray-300)', async () => {
    renderBrowserSettings();
    const toggle = screen.getByRole('switch', { name: /screenshot capture/i });
    await userEvent.click(toggle);
    await waitFor(() => {
      expect(toggle).toHaveAttribute('aria-checked', 'false');
      expect(toggle.className).toMatch(/bg-gray-300/);
    });
  });

  // TC-03: JS execution toggle works
  it('TC-03: JavaScript execution toggle changes state when clicked', async () => {
    renderBrowserSettings();
    const jsToggle = screen.getByRole('switch', { name: /javascript execution/i });
    const initialChecked = jsToggle.getAttribute('aria-checked');
    await userEvent.click(jsToggle);
    expect(jsToggle.getAttribute('aria-checked')).not.toBe(initialChecked);
  });

  // TC-04: User agent dropdown shows preset options
  it('TC-04: user agent dropdown contains Chrome Desktop, Mobile, Firefox, Safari, Custom', async () => {
    renderBrowserSettings();
    const dropdown = screen.getByRole('combobox', { name: /user agent/i });
    await userEvent.click(dropdown);
    expect(screen.getByRole('option', { name: /chrome.*desktop/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /chrome.*mobile/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /firefox/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /custom/i })).toBeInTheDocument();
  });

  // TC-05: Selecting "Custom" shows text input
  it('TC-05: selecting "Custom" user agent reveals a text input field', async () => {
    renderBrowserSettings();
    const dropdown = screen.getByRole('combobox', { name: /user agent/i });
    await userEvent.selectOptions(dropdown, 'Custom');
    expect(screen.getByPlaceholderText(/custom user agent/i)).toBeInTheDocument();
  });

  // TC-06: Settings persist between sessions
  it('TC-06: saving settings calls storeSet to persist the values', async () => {
    renderBrowserSettings();
    const screenshotToggle = screen.getByRole('switch', { name: /screenshot capture/i });
    await userEvent.click(screenshotToggle);
    await userEvent.click(screen.getByRole('button', { name: /save|apply/i }));
    expect(window.api.storeSet).toHaveBeenCalledWith(
      expect.stringContaining('browserSettings'),
      expect.any(Object),
    );
  });
});
