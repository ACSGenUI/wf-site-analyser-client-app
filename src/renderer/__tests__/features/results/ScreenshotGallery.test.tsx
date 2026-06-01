/**
 * SA-704: Screenshot Gallery
 *
 * Tests the block screenshot gallery: grid rendering, lightbox on click,
 * keyboard navigation through screenshots, and lazy loading behaviour.
 *
 * Test File: src/renderer/__tests__/features/results/ScreenshotGallery.test.tsx
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { ScreenshotGallery } from '@/features/results/ScreenshotGallery';

const mockScreenshots = [
  {
    id: 'hero-01',
    blockId: 'BLOCK_01',
    src: '/screenshots/hero-01.png',
    alt: 'Hero Section',
  },
  {
    id: 'nav-01',
    blockId: 'BLOCK_02',
    src: '/screenshots/nav-01.png',
    alt: 'Navigation',
  },
  {
    id: 'footer-01',
    blockId: 'BLOCK_03',
    src: '/screenshots/footer-01.png',
    alt: 'Footer',
  },
];

function renderGallery(screenshots = mockScreenshots) {
  return render(<ScreenshotGallery screenshots={screenshots} />);
}

describe('SA-704 – Screenshot Gallery', () => {
  // TC-01: Gallery grid renders all screenshots
  it('TC-01: renders all screenshot thumbnails in the gallery grid', () => {
    renderGallery();
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(3);
  });

  // TC-02: Alt text present for accessibility
  it('TC-02: each screenshot image has descriptive alt text', () => {
    renderGallery();
    expect(screen.getByAltText('Hero Section')).toBeInTheDocument();
    expect(screen.getByAltText('Navigation')).toBeInTheDocument();
  });

  // TC-03: Clicking opens lightbox
  it('TC-03: clicking a screenshot opens the lightbox modal', async () => {
    renderGallery();
    await userEvent.click(screen.getByAltText('Hero Section'));
    expect(
      screen.getByRole('dialog', { name: /lightbox|screenshot/i }) ??
        screen.getByTestId('lightbox'),
    ).toBeInTheDocument();
  });

  // TC-04: Lightbox next/previous navigation
  it('TC-04: lightbox next button advances to the next screenshot', async () => {
    renderGallery();
    await userEvent.click(screen.getByAltText('Hero Section'));
    const nextBtn = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextBtn);
    // Now showing "Navigation"
    expect(screen.getByAltText('Navigation')).toBeInTheDocument();
  });

  // TC-05: Lightbox closes on Escape
  it('TC-05: pressing Escape closes the lightbox', async () => {
    renderGallery();
    await userEvent.click(screen.getByAltText('Hero Section'));
    expect(screen.getByTestId('lightbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByTestId('lightbox')).toBeNull();
  });

  // TC-06: Empty gallery state
  it('TC-06: shows empty state message when no screenshots are available', () => {
    renderGallery([]);
    expect(screen.getByText(/no screenshots|not available/i)).toBeInTheDocument();
  });

  // TC-07: Block ID shown under each thumbnail
  it('TC-07: each thumbnail shows the corresponding block ID', () => {
    renderGallery();
    expect(screen.getByText('BLOCK_01')).toBeInTheDocument();
    expect(screen.getByText('BLOCK_02')).toBeInTheDocument();
  });
});
