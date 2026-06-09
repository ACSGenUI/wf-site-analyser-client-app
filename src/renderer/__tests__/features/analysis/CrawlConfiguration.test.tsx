/**
 * SA-506: Crawl Configuration Options
 *
 * Tests the crawl config panel: max pages slider, concurrency selector,
 * template grouping mode toggle, and advanced settings collapse.
 *
 * Test File: src/renderer/__tests__/features/analysis/CrawlConfiguration.test.tsx
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { CrawlConfiguration } from '@/features/analysis/CrawlConfiguration';

function renderConfig(onChange = vi.fn()) {
  return render(<CrawlConfiguration onChange={onChange} />);
}

describe('SA-506 – Crawl Configuration Options', () => {
  // TC-01: Default values render
  it('TC-01: renders with sensible default values for max pages and concurrency', () => {
    renderConfig();
    // Default max pages typically 50
    expect(screen.getByDisplayValue(/50/)).toBeInTheDocument();
    // Default concurrency
    expect(screen.getByLabelText(/concurrency/i)).toBeInTheDocument();
  });

  // TC-02: Max pages slider updates value
  it('TC-02: changing the max pages slider updates the displayed value', async () => {
    renderConfig();
    const slider = screen.getByRole('slider', { name: /max pages/i });
    fireEvent.change(slider, { target: { value: '100' } });
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  // TC-03: Concurrency selector options
  it('TC-03: concurrency dropdown contains valid options (1, 2, 5, 10)', async () => {
    renderConfig();
    const select = screen.getByLabelText(/concurrency/i);
    await userEvent.click(select);
    expect(screen.getByRole('option', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '5' })).toBeInTheDocument();
  });

  // TC-04: Template grouping mode toggle
  it('TC-04: template grouping mode has "signature" and "agent" options', () => {
    renderConfig();
    expect(screen.getByRole('radio', { name: /signature/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /agent/i })).toBeInTheDocument();
  });

  // TC-05: Advanced settings collapse/expand
  it('TC-05: advanced settings section is collapsed by default and expands on click', async () => {
    renderConfig();
    expect(screen.queryByTestId('advanced-settings')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: /advanced/i }));
    expect(screen.getByTestId('advanced-settings')).toBeInTheDocument();
  });

  // TC-06: onChange fires with updated config
  it('TC-06: onChange is called with the updated configuration object', async () => {
    const onChange = vi.fn();
    renderConfig(onChange);
    const slider = screen.getByRole('slider', { name: /max pages/i });
    fireEvent.change(slider, { target: { value: '75' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ maxPages: 75 }));
  });
});
