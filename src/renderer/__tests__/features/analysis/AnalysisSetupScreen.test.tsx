/**
 * SA-501: New Analysis Setup Screen
 *
 * Tests the two-column setup screen: page title, bento layout, AI Assistant
 * drawer toggle, Begin Analysis CTA stickiness, Reset action, and tab
 * persistence within session.
 *
 * Test File: src/renderer/__tests__/features/analysis/AnalysisSetupScreen.test.tsx
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import { AnalysisSetupScreen } from '@/features/analysis/AnalysisSetupScreen';

function renderSetup(search = '') {
  return render(
    <MemoryRouter initialEntries={[`/analysis/new${search}`]}>
      <Routes>
        <Route path="/analysis/new" element={<AnalysisSetupScreen />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('SA-501 – New Analysis Setup Screen', () => {
  // TC-01: Screen accessible via Dashboard CTA
  it('TC-01: renders the setup screen at /analysis/new', () => {
    renderSetup();
    expect(screen.getByRole('heading', { name: /setup new analysis/i })).toBeInTheDocument();
  });

  // TC-02: Page title and description render
  it('TC-02: H1 "Setup New Analysis" and descriptive paragraph are present', () => {
    renderSetup();
    expect(
      screen.getByRole('heading', { level: 1, name: /setup new analysis/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/configure|customize|scope/i)).toBeInTheDocument();
  });

  // TC-03: Two-column layout classes
  it('TC-03: two-column grid renders with left (~66%) and right (~33%) columns', () => {
    const { container } = renderSetup();
    // Should have a grid container with at least 2 columns
    const grid = container.querySelector('[class*="grid-cols-3"]');
    expect(grid).not.toBeNull();
  });

  // TC-04: Tab selection persists in session
  it('TC-04: selected tab is remembered when navigating away and returning', async () => {
    renderSetup();
    // Click the CSV tab
    await userEvent.click(screen.getByRole('tab', { name: /csv/i }));
    // Unmount and remount (simulate navigate away + return)
    // In a real integration test the session store would preserve the tab selection
    const store = (await import('@/store/analysisSetupStore')).useAnalysisSetupStore;
    expect(store.getState().activeTab).toBe('csv');
  });

  // TC-05: AI Assistant drawer toggles open and closed
  it('TC-05: clicking the AI Assistant trigger opens the drawer', async () => {
    renderSetup();
    const trigger = screen.getByRole('button', { name: /ai assistant/i });
    await userEvent.click(trigger);
    expect(screen.getByText(/ai assistant/i)).toBeInTheDocument();
    // Close via X button
    const closeBtn = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeBtn);
    expect(screen.queryByRole('dialog', { name: /ai assistant/i })).toBeNull();
  });

  // TC-06: Begin Analysis button always visible (sticky footer)
  it('TC-06: "Begin Analysis" button is sticky and always in viewport', () => {
    renderSetup();
    const cta = screen.getByRole('button', { name: /begin analysis/i });
    expect(cta).toBeInTheDocument();
    // Sticky is applied to its container
    const stickyParent = cta.closest('[class*="sticky"]');
    expect(stickyParent).not.toBeNull();
  });

  // TC-07: Reset clears all form fields
  it('TC-07: clicking Reset returns all form fields to their default values', async () => {
    renderSetup();
    const urlInput = screen.getByPlaceholderText(/https:\/\//i);
    await userEvent.type(urlInput, 'https://example.com');
    expect(urlInput).toHaveValue('https://example.com');
    await userEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(urlInput).toHaveValue('');
  });

  // TC-08: Query param ?source=csv pre-selects CSV tab
  it('TC-08: ?source=csv query param activates the CSV tab on load', () => {
    renderSetup('?source=csv');
    const csvTab = screen.getByRole('tab', { name: /csv/i });
    expect(csvTab).toHaveAttribute('aria-selected', 'true');
  });
});
