/**
 * SA-508: AI Assistant Setup Guide
 *
 * Tests the collapsible AI assistant drawer on the analysis setup screen:
 * opening/closing, contextual tips based on active tab, and the "+ New Query"
 * interaction.
 *
 * Test File: src/renderer/__tests__/features/analysis/AIAssistantSetupGuide.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AIAssistantDrawer } from '@/features/analysis/AIAssistantDrawer';

function renderDrawer(props: { isOpen?: boolean; activeTab?: string; onClose?: () => void } = {}) {
  return render(
    <AIAssistantDrawer
      isOpen={props.isOpen ?? true}
      activeTab={props.activeTab ?? 'url'}
      onClose={props.onClose ?? vi.fn()}
    />,
  );
}

describe('SA-508 – AI Assistant Setup Guide', () => {
  // TC-01: Drawer opens and shows heading
  it('TC-01: open drawer displays "AI ASSISTANT" heading', () => {
    renderDrawer({ isOpen: true });
    expect(screen.getByText(/ai assistant/i)).toBeInTheDocument();
  });

  // TC-02: Pro-tip card shows for URL tab
  it('TC-02: pro-tip card renders with blue left border for the URL tab', () => {
    renderDrawer({ activeTab: 'url' });
    const tip = screen.getByTestId('pro-tip-card');
    expect(tip).toBeInTheDocument();
    expect(tip.className).toMatch(/border-l-4.*border-blue-500|border-blue-500.*border-l-4/);
  });

  // TC-03: Contextual tips change per tab
  it('TC-03: tip text changes when activeTab switches to "csv"', () => {
    const { rerender } = renderDrawer({ activeTab: 'url' });
    const urlTipText = screen.getByTestId('pro-tip-card').textContent;

    rerender(
      <AIAssistantDrawer isOpen={true} activeTab="csv" onClose={vi.fn()} />,
    );
    const csvTipText = screen.getByTestId('pro-tip-card').textContent;
    expect(csvTipText).not.toBe(urlTipText);
  });

  // TC-04: Close via X button
  it('TC-04: clicking X calls the onClose callback', async () => {
    const onClose = vi.fn();
    renderDrawer({ onClose });
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // TC-05: New Query button renders
  it('TC-05: "+ New Query" button is visible when drawer is open', () => {
    renderDrawer({ isOpen: true });
    expect(screen.getByRole('button', { name: /new query/i })).toBeInTheDocument();
  });

  // TC-06: Drawer hidden when isOpen=false
  it('TC-06: drawer content is not visible when isOpen is false', () => {
    renderDrawer({ isOpen: false });
    expect(screen.queryByText(/ai assistant/i)).toBeNull();
  });
});
