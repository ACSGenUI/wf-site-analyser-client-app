/**
 * SA-706: Confidence & Status Indicators
 *
 * Tests the visual confidence indicators used across block and template entries:
 * colour coding by confidence level, tooltip text, and accessible labels.
 *
 * Test File: src/renderer/__tests__/features/results/ConfidenceStatusIndicators.test.tsx
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfidenceIndicator } from '@/features/results/ConfidenceIndicator';

function renderIndicator(confidence: number, label = 'Hero Section') {
  return render(<ConfidenceIndicator confidence={confidence} label={label} />);
}

describe('SA-706 – Confidence & Status Indicators', () => {
  // TC-01: High confidence (≥0.9) shows green
  it('TC-01: confidence ≥ 0.9 renders with a green class', () => {
    renderIndicator(0.95, 'Hero');
    const indicator = screen.getByTestId('confidence-indicator');
    expect(indicator.className).toMatch(/green/i);
  });

  // TC-02: Medium confidence (0.6–0.89) shows amber
  it('TC-02: confidence 0.6–0.89 renders with an amber/yellow class', () => {
    renderIndicator(0.75, 'Nav');
    const indicator = screen.getByTestId('confidence-indicator');
    expect(indicator.className).toMatch(/amber|yellow/i);
  });

  // TC-03: Low confidence (<0.6) shows red
  it('TC-03: confidence < 0.6 renders with a red class', () => {
    renderIndicator(0.45, 'Footer');
    const indicator = screen.getByTestId('confidence-indicator');
    expect(indicator.className).toMatch(/red/i);
  });

  // TC-04: Percentage shown
  it('TC-04: confidence value is displayed as a percentage', () => {
    renderIndicator(0.82);
    expect(screen.getByText(/82%/)).toBeInTheDocument();
  });

  // TC-05: Tooltip on hover shows label and score
  it('TC-05: hovering over the indicator shows a tooltip with block label and confidence', async () => {
    renderIndicator(0.95, 'Hero Section');
    const indicator = screen.getByTestId('confidence-indicator');
    await userEvent.hover(indicator);
    expect(screen.getByRole('tooltip') ?? screen.getByText(/Hero Section.*95%|95%.*Hero Section/i)).toBeInTheDocument();
  });

  // TC-06: Accessible aria-label present
  it('TC-06: indicator has aria-label describing confidence level', () => {
    renderIndicator(0.95, 'Hero Section');
    const indicator = screen.getByTestId('confidence-indicator');
    expect(indicator).toHaveAttribute('aria-label', expect.stringMatching(/95%|high confidence|Hero Section/i));
  });

  // TC-07: Zero confidence edge case
  it('TC-07: confidence of 0 renders without crash', () => {
    const { container } = renderIndicator(0, 'Unknown');
    expect(container).toBeInTheDocument();
    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });
});
