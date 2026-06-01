/**
 * SA-803: Conversation History
 *
 * Tests conversation history persistence: messages saved to local storage,
 * history reloaded on remount, clearing history, and history grouped by session.
 *
 * Test File: src/renderer/__tests__/features/chat/ConversationHistory.test.tsx
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { ConversationHistoryPanel } from '@/features/chat/ConversationHistoryPanel';
import { useChatStore } from '@/store/chatStore';

const ANALYSIS_ID = 'analysis-001';
const USER_ID = 'guest-uuid-1234';

const sampleHistory = [
  {
    id: 'msg-1',
    role: 'user' as const,
    content: 'What blocks were found?',
    timestamp: Date.now() - 60000,
  },
  {
    id: 'msg-2',
    role: 'assistant' as const,
    content: '12 blocks were extracted.',
    timestamp: Date.now() - 55000,
  },
];

describe('SA-803 – Conversation History', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useChatStore.setState({ conversations: {} });
  });

  // TC-01: Messages persisted to storage
  it('TC-01: sending a message persists it to local storage via storeSet', async () => {
    const store = useChatStore.getState();
    store.addMessage(ANALYSIS_ID, {
      id: 'msg-1',
      role: 'user',
      content: 'Hello',
      timestamp: Date.now(),
    });
    expect(window.api.storeSet).toHaveBeenCalledWith(
      expect.stringContaining(`chat:${ANALYSIS_ID}`),
      expect.any(Array),
    );
  });

  // TC-02: History reloaded on remount
  it('TC-02: previous conversation messages appear on re-render from storage', async () => {
    vi.mocked(window.api.storeGet).mockImplementation(async (key: string) => {
      if (key.includes(`chat:${ANALYSIS_ID}`)) return sampleHistory;
      return null;
    });
    render(<ConversationHistoryPanel analysisId={ANALYSIS_ID} userId={USER_ID} />);
    await waitFor(() => {
      expect(screen.getByText('What blocks were found?')).toBeInTheDocument();
    });
  });

  // TC-03: Clear history removes all messages
  it('TC-03: clicking "Clear History" empties the conversation', async () => {
    useChatStore.setState({ conversations: { [ANALYSIS_ID]: sampleHistory } });
    render(<ConversationHistoryPanel analysisId={ANALYSIS_ID} userId={USER_ID} />);
    await userEvent.click(screen.getByRole('button', { name: /clear history/i }));
    // Confirm dialog
    await userEvent.click(screen.getByRole('button', { name: /confirm|yes/i }));
    await waitFor(() => {
      expect(screen.queryByText('What blocks were found?')).toBeNull();
    });
  });

  // TC-04: Timestamps shown next to messages
  it('TC-04: each message entry shows a timestamp', () => {
    useChatStore.setState({ conversations: { [ANALYSIS_ID]: sampleHistory } });
    render(<ConversationHistoryPanel analysisId={ANALYSIS_ID} userId={USER_ID} />);
    // Timestamps should render in some format
    expect(screen.getAllByTestId('message-timestamp').length).toBeGreaterThanOrEqual(2);
  });

  // TC-05: Empty history renders empty state
  it('TC-05: renders an empty state when no history exists for the analysis', () => {
    render(<ConversationHistoryPanel analysisId="new-analysis-999" userId={USER_ID} />);
    expect(screen.getByText(/no conversation|start asking/i)).toBeInTheDocument();
  });
});
