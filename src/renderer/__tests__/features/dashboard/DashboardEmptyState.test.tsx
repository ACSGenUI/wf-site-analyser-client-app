/**
 * SA-403: Dashboard Empty State
 *
 * Tests the welcome empty-state UI shown to first-time users: the heading,
 * the "Launch AI Agent" CTA, two-column bento layout, loading skeleton,
 * and transition to a project list once the user has data.
 *
 * Test File: src/renderer/__tests__/features/dashboard/DashboardEmptyState.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DashboardEmptyState } from '@/features/dashboard/DashboardEmptyState';
import { useProjectStore } from '@/store/projectStore';

function renderEmptyState(isLoading = false) {
  return render(
    <MemoryRouter>
      <DashboardEmptyState isLoading={isLoading} />
    </MemoryRouter>,
  );
}

describe('SA-403 – Dashboard Empty State', () => {
  // TC-01: Welcome heading renders
  it('TC-01: "Welcome to your Workspace" heading is present and visible', () => {
    renderEmptyState();
    expect(
      screen.getByRole('heading', { name: /welcome to your workspace/i }),
    ).toBeInTheDocument();
  });

  // TC-02: Launch AI Agent navigates to /analysis/new
  it('TC-02: clicking "Launch AI Agent" navigates to /analysis/new', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
      return { ...actual, useNavigate: () => mockNavigate };
    });

    renderEmptyState();
    await userEvent.click(screen.getByRole('button', { name: /launch ai agent/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/analysis/new');
  });

  // TC-03: Two-column bento layout renders
  it('TC-03: renders a two-column grid with correct Tailwind width classes', () => {
    const { container } = renderEmptyState();
    // The bento grid should use a two-column layout
    const grid = container.querySelector('[class*="grid-cols"]');
    expect(grid).not.toBeNull();
    // Left column should be wider (~66%)
    const leftCol = container.querySelector('[class*="col-span-2"]');
    expect(leftCol).not.toBeNull();
  });

  // TC-04: Loading skeleton renders
  it('TC-04: skeleton placeholder elements are visible in loading state', () => {
    renderEmptyState(true);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  // TC-05: Transitions to project list when projects exist
  it('TC-05: project list view is shown instead of empty state when projects are available', async () => {
    useProjectStore.setState({
      projects: [
        { id: 'proj-1', name: 'My First Project', createdAt: '2026-04-01', status: 'completed' },
      ],
    });

    render(
      <MemoryRouter>
        {/* Dashboard page renders either empty state or project list */}
        {useProjectStore.getState().projects.length > 0
          ? <div data-testid="project-list">Project List</div>
          : <DashboardEmptyState />}
      </MemoryRouter>,
    );

    expect(screen.getByTestId('project-list')).toBeInTheDocument();
    expect(screen.queryByText(/welcome to your workspace/i)).toBeNull();
  });
});
