/**
 * SA-804: Suggested Prompt Chips
 *
 * Tests the clickable suggestion chips above the chat input: rendering,
 * click-to-fill behaviour, and dynamic chips based on analysis context.
 *
 * Test File: src/renderer/__tests__/features/chat/SuggestedPromptChips.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SuggestedPromptChips } from '@/features/chat/SuggestedPromptChips';

const defaultSuggestions = [
  'How many blocks were extracted?',
  'Summarize the templates found',
  'Which integrations were detected?',
  'Show me the Hero Section block',
];

function renderChips(suggestions = defaultSuggestions, onSelect = vi.fn()) {
  return render(<SuggestedPromptChips suggestions={suggestions} onSelect={onSelect} />);
}

describe('SA-804 – Suggested Prompt Chips', () => {
  // TC-01: All chips render
  it('TC-01: renders all suggestion chips', () => {
    renderChips();
    defaultSuggestions.forEach((text) => {
      expect(screen.getByRole('button', { name: text })).toBeInTheDocument();
    });
  });

  // TC-02: Click-to-select fills input
  it('TC-02: clicking a chip invokes onSelect with the suggestion text', async () => {
    const onSelect = vi.fn();
    renderChips(defaultSuggestions, onSelect);
    await userEvent.click(
      screen.getByRole('button', { name: 'How many blocks were extracted?' }),
    );
    expect(onSelect).toHaveBeenCalledWith('How many blocks were extracted?');
  });

  // TC-03: Chips styled as pills
  it('TC-03: each chip has pill-style Tailwind classes (rounded-full)', () => {
    renderChips();
    const chip = screen.getByRole('button', { name: 'Summarize the templates found' });
    expect(chip.className).toMatch(/rounded-full|rounded-lg/);
  });

  // TC-04: Chips hidden when conversation has messages
  it('TC-04: chips are not rendered when hasMessages=true', () => {
    render(
      <SuggestedPromptChips
        suggestions={defaultSuggestions}
        onSelect={vi.fn()}
        hasMessages={true}
      />,
    );
    expect(screen.queryByRole('button', { name: /how many blocks/i })).toBeNull();
  });

  // TC-05: Empty suggestions array renders nothing
  it('TC-05: renders nothing when suggestions array is empty', () => {
    const { container } = renderChips([]);
    expect(container).toBeEmptyDOMElement();
  });

  // TC-06: Chips are keyboard-accessible
  it('TC-06: chips are focusable and can be activated via Enter key', async () => {
    const onSelect = vi.fn();
    renderChips(defaultSuggestions, onSelect);
    const chip = screen.getByRole('button', { name: defaultSuggestions[0] });
    chip.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalled();
  });
});
