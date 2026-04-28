/**
 * SA-906: Settings AI Assistant Panel
 *
 * Tests the AI assistant side panel within settings: opening, pro-tip rendering,
 * settings history list, contextual tip rotation, and close behaviour.
 *
 * Test File: src/renderer/__tests__/features/settings/SettingsAIAssistant.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsAIAssistant } from '@/features/settings/SettingsAIAssistant';

const mockHistory = [
  { action: 'API Key Rotation', timestamp: Date.now() - 7200000, tab: 'api-keys', field: 'openai' },
  { action: 'Browser Toggle', timestamp: Date.now() - 3600000, tab: 'browser', field: 'screenshots' },
];

function renderPanel(props: { isOpen?: boolean; activeTab?: string; onClose?: () => void } = {}) {
  return render(
    <SettingsAIAssistant
      isOpen={props.isOpen ?? true}
      activeTab={props.activeTab ?? 'api-keys'}
      history={mockHistory}
      onClose={props.onClose ?? vi.fn()}
    />,
  );
}

describe('SA-906 – Settings AI Assistant Panel', () => {
  // TC-01: Panel opens with "AI ASSISTANT" heading
  it('TC-01: open panel shows "AI ASSISTANT" heading', () => {
    renderPanel({ isOpen: true });
    expect(screen.getByText(/ai assistant/i)).toBeInTheDocument();
  });

  // TC-02: Pro-tip card has blue border
  it('TC-02: pro-tip card has border-l-4 border-blue-500 classes', () => {
    renderPanel({ isOpen: true });
    const tipCard = screen.getByTestId('pro-tip-card');
    expect(tipCard.className).toMatch(/border-l-4/);
    expect(tipCard.className).toMatch(/border-blue-500/);
  });

  // TC-03: Settings history shows recent changes
  it('TC-03: settings history list renders entries with timestamps', () => {
    renderPanel({ isOpen: true });
    expect(screen.getByText(/api key rotation/i)).toBeInTheDocument();
    expect(screen.getByText(/browser toggle/i)).toBeInTheDocument();
    expect(screen.getByText(/hours? ago|2 hours?/i)).toBeInTheDocument();
  });

  // TC-04: Close via X button
  it('TC-04: clicking X calls the onClose callback', async () => {
    const onClose = vi.fn();
    renderPanel({ onClose });
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // TC-05: Contextual tips change when activeTab switches
  it('TC-05: pro-tip text updates when activeTab changes from api-keys to browser', () => {
    const { rerender } = renderPanel({ activeTab: 'api-keys' });
    const apiTipText = screen.getByTestId('pro-tip-card').textContent;

    rerender(
      <SettingsAIAssistant
        isOpen={true}
        activeTab="browser"
        history={mockHistory}
        onClose={vi.fn()}
      />,
    );
    const browserTipText = screen.getByTestId('pro-tip-card').textContent;
    expect(browserTipText).not.toBe(apiTipText);
  });

  // TC-06: Panel hidden when isOpen=false
  it('TC-06: panel content is not rendered when isOpen is false', () => {
    renderPanel({ isOpen: false });
    expect(screen.queryByText(/ai assistant/i)).toBeNull();
  });
});
