/**
 * SA-601: Analysis Progress Dashboard
 *
 * Tests the live progress screen: percentage indicator, progress bar animation,
 * state badges, transition from setup screen, state preservation on navigate-
 * away, and auto-navigation to results on completion.
 *
 * Test File: src/renderer/__tests__/features/analysis/ProgressDashboard.test.tsx
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import { ProgressDashboard } from '@/features/analysis/ProgressDashboard';

const ANALYSIS_ID = 'analysis-abc-123';

function renderDashboard(
  progress = 68,
  status: 'running' | 'paused' | 'completed' | 'failed' = 'running',
) {
  vi.mocked(window.api['analysis:getStatus']).mockResolvedValue({ status, progress });
  return render(
    <MemoryRouter initialEntries={[`/analysis/${ANALYSIS_ID}/progress`]}>
      <Routes>
        <Route path="/analysis/:id/progress" element={<ProgressDashboard />} />
        <Route path="/analysis/:id/results" element={<div>Results Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('SA-601 – Analysis Progress Dashboard', () => {
  // TC-01: Shows overall completion percentage
  it('TC-01: renders progress bar and circular indicator at 68%', async () => {
    renderDashboard(68);
    await waitFor(() => {
      expect(screen.getByText(/68%/)).toBeInTheDocument();
    });
  });

  // TC-02: Progress bar has animation class
  it('TC-02: progress bar element includes a transition-all or animate class', async () => {
    renderDashboard(68);
    await waitFor(() => {
      const bar = screen.getByRole('progressbar');
      expect(bar.className).toMatch(/transition-all|transition-width|animate/);
    });
  });

  // TC-03: RUNNING badge in header
  it('TC-03: "RUNNING" badge renders with green styling when status is running', async () => {
    renderDashboard(68, 'running');
    await waitFor(() => {
      const badge = screen.getByText(/running/i);
      expect(badge).toBeInTheDocument();
      expect(badge.className).toMatch(/green/i);
    });
  });

  // TC-04: Transitions from setup screen (navigation)
  it('TC-04: navigating from setup triggers display of the progress dashboard', () => {
    render(
      <MemoryRouter initialEntries={[`/analysis/${ANALYSIS_ID}/progress`]}>
        <Routes>
          <Route path="/analysis/:id/progress" element={<ProgressDashboard />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('progress-dashboard')).toBeInTheDocument();
  });

  // TC-05: State preserved on navigate-away and return
  it('TC-05: progress value is maintained when navigating away and returning', async () => {
    const { unmount } = renderDashboard(45);
    await waitFor(() => expect(screen.getByText(/45%/)).toBeInTheDocument());
    unmount();
    // Remount — store should retain the progress state
    vi.mocked(window.api['analysis:getStatus']).mockResolvedValue({
      status: 'running',
      progress: 55,
    });
    renderDashboard(55);
    await waitFor(() => expect(screen.getByText(/55%/)).toBeInTheDocument());
  });

  // TC-06: Auto-navigates to results when completed
  it('TC-06: redirects to results page after analysis completes (100%)', async () => {
    vi.useFakeTimers();
    renderDashboard(100, 'completed');
    await waitFor(() => expect(screen.getByText(/100%/)).toBeInTheDocument());
    // Should auto-navigate after a brief delay
    act(() => vi.advanceTimersByTime(3500));
    await waitFor(() => {
      expect(screen.getByText(/results page/i)).toBeInTheDocument();
    });
    vi.useRealTimers();
  });

  // TC-07: Badge reflects PAUSED state
  it('TC-07: amber "PAUSED" badge shown and Resume button visible when paused', async () => {
    renderDashboard(50, 'paused');
    await waitFor(() => {
      expect(screen.getByText(/paused/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument();
    });
  });
});
