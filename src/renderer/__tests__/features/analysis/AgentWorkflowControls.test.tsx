/**
 * SA-606: Agent Workflow Controls
 *
 * Tests the Pause, Resume, Cancel, and Retry controls on the progress screen:
 * button visibility per state, IPC calls, and confirmation dialogs for
 * destructive actions (Cancel).
 *
 * Test File: src/renderer/__tests__/features/analysis/AgentWorkflowControls.test.tsx
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { AgentWorkflowControls } from '@/features/analysis/AgentWorkflowControls';

const ANALYSIS_ID = 'analysis-xyz';

function renderControls(status: 'running' | 'paused' | 'completed' | 'failed' = 'running') {
  return render(<AgentWorkflowControls analysisId={ANALYSIS_ID} status={status} />);
}

describe('SA-606 – Agent Workflow Controls', () => {
  // TC-01: Pause button shown when running
  it('TC-01: "Pause" button is visible when status is running', () => {
    renderControls('running');
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  // TC-02: Pause calls IPC
  it('TC-02: clicking Pause invokes the analysis:pause IPC handler', async () => {
    renderControls('running');
    await userEvent.click(screen.getByRole('button', { name: /pause/i }));
    expect(window.api['analysis:pause']).toHaveBeenCalledWith(ANALYSIS_ID);
  });

  // TC-03: Resume button shown when paused
  it('TC-03: "Resume" button is visible when status is paused', () => {
    renderControls('paused');
    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument();
  });

  // TC-04: Resume calls IPC
  it('TC-04: clicking Resume invokes the analysis:resume IPC handler', async () => {
    renderControls('paused');
    await userEvent.click(screen.getByRole('button', { name: /resume/i }));
    expect(window.api['analysis:resume']).toHaveBeenCalledWith(ANALYSIS_ID);
  });

  // TC-05: Cancel requires confirmation
  it('TC-05: clicking Cancel shows a confirmation dialog before cancelling', async () => {
    renderControls('running');
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.getByRole('alertdialog') ?? screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/are you sure|confirm cancel/i)).toBeInTheDocument();
  });

  // TC-06: Confirming cancel calls IPC
  it('TC-06: confirming Cancel invokes the analysis:cancel IPC handler', async () => {
    renderControls('running');
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    await userEvent.click(screen.getByRole('button', { name: /confirm|yes/i }));
    expect(window.api['analysis:cancel']).toHaveBeenCalledWith(ANALYSIS_ID);
  });

  // TC-07: Retry button shown on failure
  it('TC-07: "Retry" button is shown when analysis has failed', () => {
    renderControls('failed');
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  // TC-08: Controls hidden when completed
  it('TC-08: no control buttons (Pause/Cancel/Resume) are shown when completed', () => {
    renderControls('completed');
    expect(screen.queryByRole('button', { name: /pause|cancel|resume/i })).toBeNull();
  });
});
