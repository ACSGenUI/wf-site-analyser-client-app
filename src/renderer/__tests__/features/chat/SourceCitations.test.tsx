/**
 * SA-802: Source Citations & References
 *
 * Tests that assistant messages include inline reference chips (e.g. [Block 12]),
 * that chips are styled as blue pills, and that clicking a chip navigates to
 * or highlights the referenced block/template in the results pane.
 *
 * Test File: src/renderer/__tests__/features/chat/SourceCitations.test.tsx
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { MessageBubble } from '@/features/chat/MessageBubble';

function renderMessage(
  content: string,
  role: 'user' | 'assistant' = 'assistant',
  onCitationClick = vi.fn(),
) {
  return render(
    <MessageBubble id="msg-1" role={role} content={content} onCitationClick={onCitationClick} />,
  );
}

describe('SA-802 – Source Citations & References', () => {
  // TC-01: Reference chips render from message text
  it('TC-01: inline [Block 12] marker renders as a styled chip', () => {
    renderMessage('Found in [Block 12] and [Template A1].');
    expect(screen.getByText('Block 12')).toBeInTheDocument();
    expect(screen.getByText('Template A1')).toBeInTheDocument();
  });

  // TC-02: Chips are styled as blue pills
  it('TC-02: reference chips have blue pill styling (bg-blue-100 or bg-blue-600)', () => {
    renderMessage('See [Block 05] for details.');
    const chip = screen.getByText('Block 05').closest('[class*="bg-blue"]');
    expect(chip).not.toBeNull();
  });

  // TC-03: Clicking chip triggers callback with reference ID
  it('TC-03: clicking a chip invokes onCitationClick with the reference ID', async () => {
    const onCitationClick = vi.fn();
    renderMessage('Refer to [Block 03].', 'assistant', onCitationClick);
    await userEvent.click(
      screen.getByText('Block 03').closest('button') ?? screen.getByText('Block 03'),
    );
    expect(onCitationClick).toHaveBeenCalledWith('Block 03');
  });

  // TC-04: Plain text without citations renders normally
  it('TC-04: message without citation markers renders as plain text without chips', () => {
    renderMessage('No citations here, just plain text.');
    expect(screen.getByText('No citations here, just plain text.')).toBeInTheDocument();
    expect(screen.queryByTestId('citation-chip')).toBeNull();
  });

  // TC-05: Multiple citations in one message
  it('TC-05: message with multiple citations renders all of them as chips', () => {
    renderMessage('[Block 01], [Block 02], and [Template B2] are the key items.');
    const chips = screen.getAllByTestId('citation-chip');
    expect(chips).toHaveLength(3);
  });

  // TC-06: User messages do not render citation chips
  it('TC-06: user role messages do not parse or render citation chips', () => {
    renderMessage('[Block 12] is interesting', 'user');
    // User messages should not have clickable chips
    expect(screen.queryByTestId('citation-chip')).toBeNull();
  });
});
