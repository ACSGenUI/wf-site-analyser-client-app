/**
 * SA-603: Live Discovery Stream
 *
 * Tests the real-time URL discovery feed: rendering discovered URLs as they
 * arrive, auto-scroll behaviour, source badges (sitemap/crawl), and status codes.
 *
 * Test File: src/renderer/__tests__/features/analysis/LiveDiscoveryStream.test.tsx
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { LiveDiscoveryStream } from '@/features/analysis/LiveDiscoveryStream';

const mockUrls = [
  { url: 'https://example.com/', source: 'sitemap', statusCode: 200 },
  { url: 'https://example.com/about', source: 'crawl', statusCode: 200 },
  { url: 'https://example.com/broken', source: 'crawl', statusCode: 404 },
];

function renderStream(urls = mockUrls) {
  return render(<LiveDiscoveryStream urls={urls} />);
}

describe('SA-603 – Live Discovery Stream', () => {
  // TC-01: Discovered URLs render in list
  it('TC-01: renders each discovered URL as a list item', () => {
    renderStream();
    expect(screen.getByText('https://example.com/')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/about')).toBeInTheDocument();
  });

  // TC-02: Source badges render
  it('TC-02: renders source badges (sitemap/crawl) next to each URL', () => {
    renderStream();
    expect(screen.getByText(/sitemap/i)).toBeInTheDocument();
    expect(screen.getAllByText(/crawl/i).length).toBeGreaterThanOrEqual(1);
  });

  // TC-03: HTTP status codes displayed
  it('TC-03: status codes are shown for each URL entry', () => {
    renderStream();
    const status200s = screen.getAllByText('200');
    expect(status200s.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  // TC-04: 404 URL styled with error colour
  it('TC-04: URLs with non-200 status codes are styled with a red/error class', () => {
    renderStream();
    const row404 = screen.getByTestId('url-row-https://example.com/broken');
    expect(row404.className).toMatch(/red|error/i);
  });

  // TC-05: Empty state shown when no URLs yet
  it('TC-05: renders a "Discovering pages..." empty state when URLs list is empty', () => {
    renderStream([]);
    expect(screen.getByText(/discovering|waiting/i)).toBeInTheDocument();
  });

  // TC-06: URL count summary
  it('TC-06: shows total URL count in a summary line', () => {
    renderStream();
    expect(screen.getByText(/3 pages?|3 url/i)).toBeInTheDocument();
  });
});
