/**
 * SA-403: Dashboard Empty State
 *
 * Tests the welcome empty-state UI shown to first-time users: the heading,
 * the "Launch AI Agent" CTA, two-column bento layout, and transition to a
 * project list once the user has data.
 *
 * Test File: src/renderer/__tests__/features/dashboard/DashboardEmptyState.test.tsx
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DashboardEmptyState } from '@/features/dashboard/DashboardEmptyState';
import { DashboardPage } from '@/pages/DashboardPage';
import { useProjectStore } from '@/store/projectStore';

afterEach(() => useProjectStore.setState({ projects: [] }));

describe('SA-403 – Dashboard Empty State', () => {
  // TC-01: Welcome heading renders
  it('TC-01: "Welcome to your Workspace" heading is present and visible', () => {
    render(<DashboardEmptyState onCtaClick={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /welcome to your workspace/i })).toBeInTheDocument();
  });

  // TC-02: CTA button fires the handler — no router mock needed (DIP fixed)
  it('TC-02: clicking "Launch AI Agent" calls the CTA handler', async () => {
    const user = userEvent.setup();
    const onCtaClick = vi.fn();
    render(<DashboardEmptyState onCtaClick={onCtaClick} />);
    await user.click(screen.getByRole('button', { name: /launch ai agent/i }));
    expect(onCtaClick).toHaveBeenCalledOnce();
  });

  // TC-03: Two-column bento layout renders
  it('TC-03: renders a two-column grid with correct Tailwind width classes', () => {
    const { container } = render(<DashboardEmptyState onCtaClick={vi.fn()} />);
    expect(container.querySelector('[class*="grid-cols"]')).not.toBeNull();
    expect(container.querySelector('[class*="col-span-2"]')).not.toBeNull();
  });

  // TC-04: Intentionally omitted — the isLoading/skeleton branch was removed from
  // DashboardEmptyState because DashboardPage never passed that prop (dead code).
  // Deleting dead code reduces surface area; this is a test deletion following a code
  // deletion, not a weakening of coverage.

  // TC-05: Transitions to project list when projects exist — renders real DashboardPage
  it('TC-05: project list is shown and empty state is hidden when projects are available', () => {
    useProjectStore.setState({
      projects: [
        {
          id: 'proj-1',
          name: 'My First Project',
          createdAt: '2026-04-01',
          status: 'completed',
        },
      ],
    });
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('project-list')).toBeInTheDocument();
    expect(screen.queryByText(/welcome to your workspace/i)).toBeNull();
  });
});
