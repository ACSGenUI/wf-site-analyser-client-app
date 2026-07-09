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
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NewAnalysisFAB } from '@/features/dashboard/NewAnalysisFAB';
import { ROUTES } from '@/routes';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderFAB() {
  return render(
    <MemoryRouter>
      <NewAnalysisFAB />
    </MemoryRouter>,
  );
}

describe('SA-406 – New Analysis FAB', () => {
  beforeEach(() => mockNavigate.mockClear());

  // TC-01: FAB renders on dashboard
  it('TC-01: FAB button is visible in the DOM', () => {
    renderFAB();
    expect(screen.getByRole('button', { name: /new analysis/i })).toBeInTheDocument();
  });

  // TC-02: FAB navigates to /analysis/new
  it('TC-02: clicking the FAB navigates to /analysis/new', async () => {
    const user = userEvent.setup();
    renderFAB();
    await user.click(screen.getByRole('button', { name: /new analysis/i }));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ANALYSIS_NEW);
  });

  // TC-03: FAB has fixed positioning classes
  it('TC-03: FAB has fixed or sticky Tailwind positioning class', () => {
    renderFAB();
    expect(screen.getByRole('button', { name: /new analysis/i }).className).toMatch(/fixed|sticky/);
  });

  // TC-04: FAB uses primary design token fill
  it('TC-04: FAB button has bg-primary Tailwind class', () => {
    renderFAB();
    expect(screen.getByRole('button', { name: /new analysis/i }).className).toMatch(/bg-primary\b/);
  });

  // TC-05: FAB is keyboard-accessible
  it('TC-05: FAB is reachable via Tab key and activatable via Enter', async () => {
    const user = userEvent.setup();
    renderFAB();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /new analysis/i }));
    await user.keyboard('{Enter}');
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ANALYSIS_NEW);
  });
});
