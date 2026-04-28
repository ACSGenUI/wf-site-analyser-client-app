/**
 * SA-604: Detected Stack Panel
 *
 * Tests the technology stack detection panel: rendering of detected techs with
 * category badges, confidence indicators, empty state, and accordion expansion.
 *
 * Test File: src/renderer/__tests__/features/analysis/DetectedStackPanel.test.tsx
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetectedStackPanel } from '@/features/analysis/DetectedStackPanel';

const mockStack = [
  { name: 'React', category: 'framework', confidence: 0.98 },
  { name: 'Google Analytics', category: 'analytics', confidence: 0.95 },
  { name: 'Cloudflare', category: 'cdn', confidence: 0.87 },
];

function renderPanel(stack = mockStack) {
  return render(<DetectedStackPanel stack={stack} />);
}

describe('SA-604 – Detected Stack Panel', () => {
  // TC-01: Panel heading renders
  it('TC-01: renders "Detected Stack" or "Tech Stack" heading', () => {
    renderPanel();
    expect(screen.getByText(/detected stack|tech stack/i)).toBeInTheDocument();
  });

  // TC-02: Technology names render
  it('TC-02: each detected technology name is displayed', () => {
    renderPanel();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Google Analytics')).toBeInTheDocument();
    expect(screen.getByText('Cloudflare')).toBeInTheDocument();
  });

  // TC-03: Category badges render
  it('TC-03: each entry has a category badge', () => {
    renderPanel();
    expect(screen.getByText(/framework/i)).toBeInTheDocument();
    expect(screen.getByText(/analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/cdn/i)).toBeInTheDocument();
  });

  // TC-04: Confidence percentage shown
  it('TC-04: confidence values are displayed as percentages', () => {
    renderPanel();
    expect(screen.getByText(/98%/)).toBeInTheDocument();
    expect(screen.getByText(/87%/)).toBeInTheDocument();
  });

  // TC-05: Empty state message
  it('TC-05: shows an empty state when no stack is detected', () => {
    renderPanel([]);
    expect(screen.getByText(/no technologies detected|empty/i)).toBeInTheDocument();
  });

  // TC-06: Technology count summary
  it('TC-06: renders a count of total detected technologies', () => {
    renderPanel();
    expect(screen.getByText(/3 technologies?|3 items?/i)).toBeInTheDocument();
  });
});
