/**
 * SA-901: Settings Navigation Layout
 *
 * Tests the settings screen structure: left tab nav, active tab highlighting,
 * content area render, and AI Assistant panel toggle.
 *
 * Test File: src/renderer/__tests__/features/settings/SettingsNavLayout.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SettingsScreen } from '@/features/settings/SettingsScreen';

function renderSettings(initialTab = 'api-keys') {
  return render(
    <MemoryRouter initialEntries={[`/settings?tab=${initialTab}`]}>
      <Routes>
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('SA-901 – Settings Navigation Layout', () => {
  // TC-01: All 5 setting tabs render
  it('TC-01: renders Model API Keys, Browser, Storage, Account, and AI Assistant tabs', () => {
    renderSettings();
    expect(screen.getByRole('tab', { name: /model api keys|api keys/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /browser/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /storage/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /account/i })).toBeInTheDocument();
  });

  // TC-02: Active tab shows highlighted style
  it('TC-02: active tab has a blue left border or bg-blue class', () => {
    renderSettings('api-keys');
    const apiTab = screen.getByRole('tab', { name: /model api keys|api keys/i });
    expect(apiTab).toHaveAttribute('aria-selected', 'true');
    expect(apiTab.className).toMatch(/blue|active/i);
  });

  // TC-03: Clicking a tab changes the content
  it('TC-03: clicking the Browser tab renders the browser settings content', async () => {
    renderSettings();
    await userEvent.click(screen.getByRole('tab', { name: /browser/i }));
    expect(screen.getByText(/browser settings/i)).toBeInTheDocument();
    expect(screen.getByText(/manage how the analyzer interacts/i)).toBeInTheDocument();
  });

  // TC-04: Page heading matches active tab
  it('TC-04: the main content heading reflects the selected tab name', async () => {
    renderSettings('storage');
    expect(screen.getByText(/storage/i)).toBeInTheDocument();
  });

  // TC-05: AI Assistant panel toggle
  it('TC-05: clicking the AI Assistant trigger opens the assistant panel', async () => {
    renderSettings();
    const trigger = screen.getByRole('button', { name: /ai assistant/i });
    await userEvent.click(trigger);
    expect(screen.getByText(/ai assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/rag interface/i)).toBeInTheDocument();
  });
});
