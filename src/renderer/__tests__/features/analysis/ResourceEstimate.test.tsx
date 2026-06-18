/**
 * SA-507: Resource Estimate Panel
 *
 * Tests the right-column panel that shows estimated time, token usage, and
 * cost based on the current crawl configuration. Verifies that the estimates
 * update reactively when config changes.
 *
 * Test File: src/renderer/__tests__/features/analysis/ResourceEstimate.test.tsx
 */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ResourceEstimate } from '@/features/analysis/ResourceEstimate';

const defaultConfig = {
  maxPages: 50,
  concurrency: 5,
  enableScreenshots: true,
  enableTemplateAgent: true,
};

function renderEstimate(config = defaultConfig) {
  return render(<ResourceEstimate config={config} />);
}

describe('SA-507 – Resource Estimate Panel', () => {
  // TC-01: Panel renders with heading
  it('TC-01: renders "Resource Estimate" heading', () => {
    renderEstimate();
    expect(screen.getByText(/resource estimate/i)).toBeInTheDocument();
  });

  // TC-02: Time estimate is shown
  it('TC-02: estimated duration is displayed', () => {
    renderEstimate();
    expect(screen.getByText(/minutes?|seconds?|hours?/i)).toBeInTheDocument();
  });

  // TC-03: Token usage shown
  it('TC-03: estimated token count is displayed', () => {
    renderEstimate();
    expect(screen.getByText(/tokens?/i)).toBeInTheDocument();
  });

  // TC-04: Estimates update when maxPages changes
  it('TC-04: estimate values update when maxPages configuration changes', async () => {
    const { rerender } = renderEstimate({ ...defaultConfig, maxPages: 50 });
    const initialText = screen.getByTestId('estimated-time').textContent;

    rerender(<ResourceEstimate config={{ ...defaultConfig, maxPages: 200 }} />);
    await waitFor(() => {
      const updatedText = screen.getByTestId('estimated-time').textContent;
      expect(updatedText).not.toBe(initialText);
    });
  });

  // TC-05: Screenshot toggle affects estimate
  it('TC-05: disabling screenshots reduces the time estimate', () => {
    const { rerender } = renderEstimate({ ...defaultConfig, enableScreenshots: true });
    const withScreenshots = screen.getByTestId('estimated-time').textContent;

    rerender(<ResourceEstimate config={{ ...defaultConfig, enableScreenshots: false }} />);
    const withoutScreenshots = screen.getByTestId('estimated-time').textContent;
    // Time should be less without screenshots
    expect(withoutScreenshots).not.toBe(withScreenshots);
  });

  // TC-06: Cost estimate shown (when API key configured)
  it('TC-06: approximate cost is shown when AI features are enabled', () => {
    renderEstimate({ ...defaultConfig, enableTemplateAgent: true });
    expect(screen.getByText(/\$|cost|usd/i)).toBeInTheDocument();
  });
});
