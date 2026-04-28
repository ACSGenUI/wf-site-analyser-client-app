/**
 * SA-405: Data Source Selection Cards
 *
 * Tests the three data source entry-point cards (URL, CSV Upload, Figma)
 * on the dashboard: rendering, selection state, navigation to the correct
 * pre-selected tab on the setup screen, and keyboard accessibility.
 *
 * Test File: src/renderer/__tests__/features/dashboard/DataSourceCards.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DataSourceCards } from '@/features/dashboard/DataSourceCards';

function renderCards() {
  return render(
    <MemoryRouter>
      <DataSourceCards />
    </MemoryRouter>,
  );
}

describe('SA-405 – Data Source Selection Cards', () => {
  // TC-01: All three cards render
  it('TC-01: renders URL, CSV Upload, and Figma cards', () => {
    renderCards();
    expect(screen.getByText(/url/i)).toBeInTheDocument();
    expect(screen.getByText(/csv/i)).toBeInTheDocument();
    expect(screen.getByText(/figma/i)).toBeInTheDocument();
  });

  // TC-02: URL card navigates with ?source=url
  it('TC-02: clicking URL card navigates to /analysis/new?source=url', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
      return { ...actual, useNavigate: () => mockNavigate };
    });
    renderCards();
    await userEvent.click(screen.getByRole('button', { name: /url/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/analysis/new?source=url');
  });

  // TC-03: CSV card navigates with ?source=csv
  it('TC-03: clicking CSV card navigates to /analysis/new?source=csv', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
      return { ...actual, useNavigate: () => mockNavigate };
    });
    renderCards();
    await userEvent.click(screen.getByRole('button', { name: /csv/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/analysis/new?source=csv');
  });

  // TC-04: Figma card navigates with ?source=figma
  it('TC-04: clicking Figma card navigates to /analysis/new?source=figma', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
      return { ...actual, useNavigate: () => mockNavigate };
    });
    renderCards();
    await userEvent.click(screen.getByRole('button', { name: /figma/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/analysis/new?source=figma');
  });

  // TC-05: Cards are keyboard-focusable and activatable
  it('TC-05: cards are accessible via keyboard (Enter activates the card)', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
      return { ...actual, useNavigate: () => mockNavigate };
    });
    renderCards();
    const urlCard = screen.getByRole('button', { name: /url/i });
    urlCard.focus();
    await userEvent.keyboard('{Enter}');
    expect(mockNavigate).toHaveBeenCalled();
  });

  // TC-06: Cards have descriptive icons
  it('TC-06: each card renders an icon element', () => {
    renderCards();
    // Each card should render an svg icon
    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons.length).toBeGreaterThanOrEqual(3);
  });
});
