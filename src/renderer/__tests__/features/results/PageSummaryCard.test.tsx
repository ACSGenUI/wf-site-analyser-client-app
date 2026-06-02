/**
 * SA-702: Page Summary Card
 *
 * Tests the card shown for each discovered page: template name, URL,
 * block count, screenshot thumbnail, and click-to-select behaviour.
 *
 * Test File: src/renderer/__tests__/features/results/PageSummaryCard.test.tsx
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { PageSummaryCard } from '@/features/results/PageSummaryCard';

const mockPage = {
  url: 'https://example.com/about',
  templateName: 'About Page',
  blockCount: 5,
  screenshotUrl: '/screenshots/about.png',
  isSelected: false,
};

function renderCard(props = mockPage, onSelect = vi.fn()) {
  return render(<PageSummaryCard page={props} onSelect={onSelect} />);
}

describe('SA-702 – Page Summary Card', () => {
  // TC-01: URL renders
  it('TC-01: displays the page URL', () => {
    renderCard();
    expect(screen.getByText(/example\.com\/about/)).toBeInTheDocument();
  });

  // TC-02: Template name shows
  it('TC-02: displays the assigned template name', () => {
    renderCard();
    expect(screen.getByText('About Page')).toBeInTheDocument();
  });

  // TC-03: Block count shown
  it('TC-03: shows the number of blocks extracted from this page', () => {
    renderCard();
    expect(screen.getByText(/5 blocks?/i)).toBeInTheDocument();
  });

  // TC-04: Screenshot thumbnail renders
  it('TC-04: renders a screenshot thumbnail image', () => {
    renderCard();
    const img = screen.getByRole('img', { name: /screenshot|about page/i });
    expect(img).toHaveAttribute('src', '/screenshots/about.png');
  });

  // TC-05: Click triggers onSelect
  it('TC-05: clicking the card invokes the onSelect callback', async () => {
    const onSelect = vi.fn();
    renderCard(mockPage, onSelect);
    await userEvent.click(screen.getByRole('article') ?? screen.getByTestId('page-card'));
    expect(onSelect).toHaveBeenCalledWith(mockPage.url);
  });

  // TC-06: Selected state applies highlight class
  it('TC-06: isSelected=true applies a blue border or highlight class', () => {
    renderCard({ ...mockPage, isSelected: true });
    const card = screen.getByRole('article') ?? screen.getByTestId('page-card');
    expect(card.className).toMatch(/border-blue-600|ring-blue|selected/);
  });

  // TC-07: Missing screenshot renders placeholder
  it('TC-07: renders a placeholder when screenshotUrl is undefined', () => {
    renderCard({ ...mockPage, screenshotUrl: undefined });
    expect(screen.getByTestId('screenshot-placeholder')).toBeInTheDocument();
  });
});
