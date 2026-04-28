/**
 * SA-404: Onboarding Info Cards
 *
 * Tests the two stacked info cards displayed on the right column of the empty
 * dashboard: "How It Works" and "What You Get", including their content,
 * step indicators, and link behaviour.
 *
 * Test File: src/renderer/__tests__/features/dashboard/OnboardingInfoCards.test.tsx
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OnboardingInfoCards } from '@/features/dashboard/OnboardingInfoCards';

function renderCards() {
  return render(
    <MemoryRouter>
      <OnboardingInfoCards />
    </MemoryRouter>,
  );
}

describe('SA-404 – Onboarding Info Cards', () => {
  // TC-01: Both cards render
  it('TC-01: renders "How It Works" and "What You Get" cards', () => {
    renderCards();
    expect(screen.getByText(/how it works/i)).toBeInTheDocument();
    expect(screen.getByText(/what you get/i)).toBeInTheDocument();
  });

  // TC-02: Step indicators present in How It Works card
  it('TC-02: How It Works card contains numbered step items', () => {
    renderCards();
    // Steps 1, 2, 3 should be present
    const steps = screen.getAllByTestId(/step-\d/);
    expect(steps.length).toBeGreaterThanOrEqual(3);
  });

  // TC-03: Benefit items in What You Get card
  it('TC-03: What You Get card lists at least 3 benefits', () => {
    renderCards();
    const benefits = screen.getAllByTestId(/benefit-/);
    expect(benefits.length).toBeGreaterThanOrEqual(3);
  });

  // TC-04: Cards stacked vertically
  it('TC-04: cards are laid out in a vertical stack (flex-col or grid rows)', () => {
    const { container } = renderCards();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toMatch(/flex-col|space-y|grid-rows/);
  });
});
