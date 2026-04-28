/**
 * SA-607: Real-Time Statistics
 *
 * Tests the live stats panel that shows pages crawled, blocks found,
 * templates discovered, and elapsed time during analysis.
 *
 * Test File: src/renderer/__tests__/features/analysis/RealTimeStatistics.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RealTimeStatistics } from '@/features/analysis/RealTimeStatistics';

const defaultStats = {
  pagesCrawled: 24,
  pagesTotal: 50,
  blocksFound: 12,
  templatesDiscovered: 4,
  elapsedSeconds: 120,
};

function renderStats(stats = defaultStats) {
  return render(<RealTimeStatistics stats={stats} />);
}

describe('SA-607 – Real-Time Statistics', () => {
  // TC-01: Pages crawled counter renders
  it('TC-01: shows pages crawled count with a "/ total" indicator', () => {
    renderStats();
    expect(screen.getByText(/24/)).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  // TC-02: Blocks found counter
  it('TC-02: shows the number of blocks extracted so far', () => {
    renderStats();
    expect(screen.getByText(/12 blocks?/i)).toBeInTheDocument();
  });

  // TC-03: Templates discovered counter
  it('TC-03: shows the number of templates discovered', () => {
    renderStats();
    expect(screen.getByText(/4 templates?/i)).toBeInTheDocument();
  });

  // TC-04: Elapsed time displayed
  it('TC-04: elapsed time is shown in human-readable format (mm:ss or "2 minutes")', () => {
    renderStats();
    expect(screen.getByText(/2:00|2 min|120s/i)).toBeInTheDocument();
  });

  // TC-05: Stats update when props change
  it('TC-05: counter values update reactively when stats prop changes', () => {
    const { rerender } = renderStats({ ...defaultStats, pagesCrawled: 24 });
    expect(screen.getByText(/24/)).toBeInTheDocument();

    rerender(<RealTimeStatistics stats={{ ...defaultStats, pagesCrawled: 35 }} />);
    expect(screen.getByText(/35/)).toBeInTheDocument();
  });

  // TC-06: Zero state renders without errors
  it('TC-06: renders cleanly with all-zero stats', () => {
    const { container } = renderStats({
      pagesCrawled: 0,
      pagesTotal: 0,
      blocksFound: 0,
      templatesDiscovered: 0,
      elapsedSeconds: 0,
    });
    expect(container).toBeInTheDocument();
    expect(screen.queryByText(/NaN|undefined/)).toBeNull();
  });
});
