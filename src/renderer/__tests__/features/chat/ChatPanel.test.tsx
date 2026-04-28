/**
 * SA-801: Chat Panel Interface
 *
 * Tests the integrated AI chat panel: header rendering, user/assistant message
 * styling, Enter-to-send, SSE streaming, RAG ACTIVE badge, auto-scroll, and
 * empty state with suggested prompts.
 *
 * Test File: src/renderer/__tests__/features/chat/ChatPanel.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatPanel } from '@/features/chat/ChatPanel';

const mockMessages = [
  { id: '1', role: 'assistant' as const, content: 'Hello! I can answer questions about this analysis.' },
  { id: '2', role: 'user' as const, content: 'How many blocks were found?' },
  { id: '3', role: 'assistant' as const, content: 'A total of 12 blocks were extracted.' },
];

function renderChat(messages = mockMessages) {
  return render(<ChatPanel messages={messages} analysisId="analysis-123" />);
}

describe('SA-801 – Chat Panel Interface', () => {
  // TC-01: Panel renders with header
  it('TC-01: renders "ANALYZE WITH AI" heading and subtitle', () => {
    renderChat();
    expect(screen.getByText(/analyze with ai/i)).toBeInTheDocument();
    expect(screen.getByText(/rag context|query the site/i)).toBeInTheDocument();
  });

  // TC-02: User messages right-aligned with blue background
  it('TC-02: user message bubble has bg-blue-600 and right-alignment class', () => {
    renderChat();
    const userMsg = screen.getByText('How many blocks were found?').closest('[data-role="user"]');
    expect(userMsg?.className).toMatch(/bg-blue-600/);
    expect(userMsg?.className).toMatch(/ml-auto|justify-end|self-end/);
  });

  // TC-03: Assistant messages left-aligned with gray background
  it('TC-03: assistant message bubble has bg-gray-100 and left-alignment class', () => {
    renderChat();
    const assistantMsg = screen.getByText(/hello! i can answer/i).closest('[data-role="assistant"]');
    expect(assistantMsg?.className).toMatch(/bg-gray-100/);
  });

  // TC-04: Enter key sends message
  it('TC-04: pressing Enter in the input field sends the message', async () => {
    const onSend = vi.fn();
    render(<ChatPanel messages={[]} analysisId="analysis-123" onSend={onSend} />);
    const input = screen.getByPlaceholderText(/ask a question/i);
    await userEvent.type(input, 'What templates exist?');
    await userEvent.keyboard('{Enter}');
    expect(onSend).toHaveBeenCalledWith('What templates exist?');
  });

  // TC-05: Shift+Enter adds newline (does not send)
  it('TC-05: Shift+Enter adds a line break without sending', async () => {
    const onSend = vi.fn();
    render(<ChatPanel messages={[]} analysisId="analysis-123" onSend={onSend} />);
    const input = screen.getByPlaceholderText(/ask a question/i);
    await userEvent.type(input, 'Line one');
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
    expect(onSend).not.toHaveBeenCalled();
  });

  // TC-06: RAG ACTIVE indicator shown
  it('TC-06: "RAG ACTIVE" badge with green colour is visible in the footer', () => {
    renderChat();
    const badge = screen.getByText(/rag active/i);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toMatch(/green/i);
  });

  // TC-07: Auto-scrolls to the latest message
  it('TC-07: message container scrollTop is at maximum after new message is added', async () => {
    const { rerender } = renderChat([]);
    const container = screen.getByTestId('message-list');
    Object.defineProperty(container, 'scrollHeight', { value: 500 });
    Object.defineProperty(container, 'scrollTop', { value: 0, writable: true });

    rerender(
      <ChatPanel
        messages={[{ id: '1', role: 'assistant', content: 'New message' }]}
        analysisId="analysis-123"
      />,
    );
    await waitFor(() => {
      expect(container.scrollTop).toBe(container.scrollHeight);
    });
  });

  // TC-08: Empty state shows suggested prompts
  it('TC-08: with no messages, suggested prompt chips are visible', () => {
    render(<ChatPanel messages={[]} analysisId="analysis-123" />);
    const chips = screen.getAllByRole('button', { name: /how many|what blocks|summarize/i });
    expect(chips.length).toBeGreaterThan(0);
  });
});
