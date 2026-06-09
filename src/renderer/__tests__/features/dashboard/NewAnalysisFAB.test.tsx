/**
 * SA-406: New Analysis FAB (Floating Action Button)
 *
 * Tests the fixed-position "+" FAB button: visibility on the dashboard,
 * navigation to the setup screen, hover animation, and accessibility.
 *
 * Test File: src/renderer/__tests__/features/dashboard/NewAnalysisFAB.test.tsx
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import { NewAnalysisFAB } from '@/features/dashboard/NewAnalysisFAB';

function renderFAB() {
  return render(
    <MemoryRouter>
      <NewAnalysisFAB />
    </MemoryRouter>,
  );
}

describe('SA-406 – New Analysis FAB', () => {
  // TC-01: FAB renders on dashboard
  it('TC-01: FAB button is visible in the DOM', () => {
    renderFAB();
    expect(screen.getByRole('button', { name: /new analysis/i })).toBeInTheDocument();
  });

  // TC-02: FAB navigates to /analysis/new
  it('TC-02: clicking the FAB navigates to /analysis/new', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
      return { ...actual, useNavigate: () => mockNavigate };
    });
    renderFAB();
    await userEvent.click(screen.getByRole('button', { name: /new analysis/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/analysis/new');
  });

  // TC-03: FAB has fixed positioning classes
  it('TC-03: FAB has fixed or sticky Tailwind positioning class', () => {
    renderFAB();
    const fab = screen.getByRole('button', { name: /new analysis/i });
    expect(fab.className).toMatch(/fixed|sticky/);
  });

  // TC-04: FAB uses primary blue fill
  it('TC-04: FAB button has bg-blue-600 Tailwind class', () => {
    renderFAB();
    const fab = screen.getByRole('button', { name: /new analysis/i });
    expect(fab.className).toMatch(/bg-blue-600/);
  });

  // TC-05: FAB is keyboard-accessible
  it('TC-05: FAB is reachable via Tab key and activatable via Enter', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
      return { ...actual, useNavigate: () => mockNavigate };
    });
    renderFAB();
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /new analysis/i }));
    await userEvent.keyboard('{Enter}');
    expect(mockNavigate).toHaveBeenCalled();
  });
});
