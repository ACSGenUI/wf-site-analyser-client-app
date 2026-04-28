/**
 * SA-602: Workflow Step Tracker
 *
 * Tests the 6-step workflow progress tracker component: step labels, active
 * step highlighting, completed step check marks, and error step indication.
 *
 * Test File: src/renderer/__tests__/features/analysis/WorkflowStepTracker.test.tsx
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkflowStepTracker } from '@/features/analysis/WorkflowStepTracker';

type StepStatus = 'pending' | 'active' | 'completed' | 'error';

const STEPS = [
  { id: 'validate', label: 'Validate', status: 'completed' as StepStatus },
  { id: 'discover', label: 'Discover', status: 'completed' as StepStatus },
  { id: 'templates', label: 'Templates', status: 'active' as StepStatus },
  { id: 'blocks', label: 'Blocks', status: 'pending' as StepStatus },
  { id: 'integrations', label: 'Integrations', status: 'pending' as StepStatus },
  { id: 'finalize', label: 'Finalize', status: 'pending' as StepStatus },
];

function renderTracker(steps = STEPS) {
  return render(<WorkflowStepTracker steps={steps} />);
}

describe('SA-602 – Workflow Step Tracker', () => {
  // TC-01: All 6 step labels render
  it('TC-01: renders all 6 workflow step labels', () => {
    renderTracker();
    ['Validate', 'Discover', 'Templates', 'Blocks', 'Integrations', 'Finalize'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  // TC-02: Active step is highlighted
  it('TC-02: active step (Templates) has a highlighted style', () => {
    renderTracker();
    const activeStep = screen.getByTestId('step-templates');
    expect(activeStep.className).toMatch(/active|blue|font-semibold/i);
  });

  // TC-03: Completed steps show check mark
  it('TC-03: completed steps (Validate, Discover) display a check mark icon', () => {
    renderTracker();
    const validateStep = screen.getByTestId('step-validate');
    expect(validateStep.querySelector('[data-icon="check"]') ?? validateStep.querySelector('.check')).not.toBeNull();
  });

  // TC-04: Pending steps are visually de-emphasised
  it('TC-04: pending steps have a muted gray style', () => {
    renderTracker();
    const blocksStep = screen.getByTestId('step-blocks');
    expect(blocksStep.className).toMatch(/gray|muted/i);
  });

  // TC-05: Error step shows error icon
  it('TC-05: step with status="error" renders an error icon', () => {
    const stepsWithError = STEPS.map((s) =>
      s.id === 'templates' ? { ...s, status: 'error' as StepStatus } : s,
    );
    renderTracker(stepsWithError);
    const errorStep = screen.getByTestId('step-templates');
    expect(
      errorStep.querySelector('[data-icon="x"]') ??
      errorStep.querySelector('.error') ??
      screen.getByRole('img', { name: /error/i })
    ).not.toBeNull();
  });

  // TC-06: Progress line connects completed steps
  it('TC-06: a connecting line exists between step indicators', () => {
    const { container } = renderTracker();
    const connector = container.querySelector('[class*="connector"]') ??
      container.querySelector('[class*="line"]');
    expect(connector).not.toBeNull();
  });
});
