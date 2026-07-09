/**
 * SA-405: Data Source Selection Cards
 *
 * Tests the three data source entry-point cards (URL, CSV Upload, Figma)
 * on the dashboard: rendering, selection state, navigation to the correct
 * pre-selected tab on the setup screen, and keyboard accessibility.
 *
 * Test File: src/renderer/__tests__/features/dashboard/DataSourceCards.test.tsx
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DataSourceCards } from '@/features/dashboard/DataSourceCards';
import { ROUTES } from '@/routes';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderCards() {
  return render(
    <MemoryRouter>
      <DataSourceCards />
    </MemoryRouter>,
  );
}

describe('SA-405 – Data Source Selection Cards', () => {
  beforeEach(() => mockNavigate.mockClear());

  // TC-01: All three cards render
  it('TC-01: renders URL, CSV Upload, and Figma cards', () => {
    renderCards();
    expect(screen.getByRole('button', { name: /website url/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /csv upload/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /figma link/i })).toBeInTheDocument();
  });

  // TC-02: URL card navigates with ?source=url
  it('TC-02: clicking URL card navigates to /analysis/new?source=url', async () => {
    const user = userEvent.setup();
    renderCards();
    await user.click(screen.getByRole('button', { name: /website url/i }));
    expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.ANALYSIS_NEW}?source=url`);
  });

  // TC-03: CSV card navigates with ?source=csv
  it('TC-03: clicking CSV card navigates to /analysis/new?source=csv', async () => {
    const user = userEvent.setup();
    renderCards();
    await user.click(screen.getByRole('button', { name: /csv/i }));
    expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.ANALYSIS_NEW}?source=csv`);
  });

  // TC-04: Figma card navigates with ?source=figma
  it('TC-04: clicking Figma card navigates to /analysis/new?source=figma', async () => {
    const user = userEvent.setup();
    renderCards();
    await user.click(screen.getByRole('button', { name: /figma/i }));
    expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.ANALYSIS_NEW}?source=figma`);
  });

  // TC-05: Cards are keyboard-focusable and activatable
  it('TC-05: cards are accessible via keyboard (Enter activates the card)', async () => {
    const user = userEvent.setup();
    renderCards();
    screen.getByRole('button', { name: /website url/i }).focus();
    await user.keyboard('{Enter}');
    expect(mockNavigate).toHaveBeenCalled();
  });

  // TC-06: Cards contain icon SVG elements
  it('TC-06: each card renders an icon element', () => {
    const { container } = renderCards();
    // Icons are decorative (aria-hidden) so query by element type
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(3);
  });
});
