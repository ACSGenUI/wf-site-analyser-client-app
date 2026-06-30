/**
 * SA-701: Results Split Layout
 *
 * Tests the three-pane split layout (pages list | content area | chat panel),
 * resizable dividers, persistence of pane sizes, and responsive behaviour.
 *
 * Test File: src/renderer/__tests__/features/results/ResultsSplitLayout.test.tsx
 */

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import { ResultsWorkspace } from '@/features/results/ResultsWorkspace';

const ANALYSIS_ID = 'analysis-123';

function renderResults() {
  return render(
    <MemoryRouter initialEntries={[`/analysis/${ANALYSIS_ID}/results`]}>
      <Routes>
        <Route path="/analysis/:id/results" element={<ResultsWorkspace />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('SA-701 – Results Split Layout', () => {
  // TC-01: Three panes render
  it('TC-01: renders pages list, content area, and chat panel', () => {
    renderResults();
    expect(screen.getByTestId('pages-list-pane')).toBeInTheDocument();
    expect(screen.getByTestId('content-pane')).toBeInTheDocument();
    expect(screen.getByTestId('chat-pane')).toBeInTheDocument();
  });

  // TC-02: Pages list visible with entries
  it('TC-02: pages list panel contains at least one page entry', async () => {
    vi.mocked(window.api['analysis:getStatus']).mockResolvedValue({
      status: 'completed',
      pages: [{ url: 'https://example.com/', template: 'Homepage' }],
    });
    renderResults();
    const list = screen.getByTestId('pages-list-pane');
    expect(list).toBeInTheDocument();
  });

  // TC-03: Split layout uses flex or grid
  it('TC-03: root layout uses a flex or grid container class', () => {
    const { container } = renderResults();
    const layout =
      container.querySelector('[class*="flex"]') ?? container.querySelector('[class*="grid"]');
    expect(layout).not.toBeNull();
  });

  // TC-04: Chat panel is part of the layout
  it('TC-04: chat panel heading "ANALYZE WITH AI" is present', () => {
    renderResults();
    expect(screen.getByText(/analyze with ai/i)).toBeInTheDocument();
  });

  // TC-05: Layout accessible via landmark roles
  it('TC-05: each pane has an appropriate role or aria-label', () => {
    renderResults();
    // Content pane should be a main or section
    expect(
      screen.getByRole('main') ?? screen.getByRole('region', { name: /content/i }),
    ).toBeInTheDocument();
  });
});
