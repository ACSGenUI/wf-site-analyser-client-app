# SA-803: Conversation History

## User Story
**As a** user,
**I want** my chat conversations preserved and accessible,
**so that** I can revisit previous questions and answers about the analysis.

## Priority
P1 — High

## Figma Reference
- **Screen**: Analysis in Progress ([`1:824`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-824))
- **Component**: AI Assistant panel — History section with past queries

## Design Specifications
- "History" section with clock/history icon in the AI Assistant panel
- List of previous query summaries (truncated to single line):
  - "Analyze site structure..."
  - "Identify React components..."
  - "Check accessibility gaps..."
- Each history item is clickable to restore that conversation
- Appears in the AI Assistant side panel on both Analysis and Results screens

## Acceptance Criteria
- [ ] Conversation history is preserved for the duration of the session
- [ ] History shows a list of previous conversations with truncated first messages
- [ ] Clicking a history item restores the full conversation in the chat panel
- [ ] "+ New Query" button starts a fresh conversation (clears current, preserves in history)
- [ ] History items show relative timestamps ("2 min ago", "1 hour ago")
- [ ] History is stored locally per analysis/project
- [ ] Maximum of 50 conversations stored per project; older ones archived

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Store conversation history in local storage or SQLite via IPC, keyed by project/analysis ID
- Each conversation: `{ id, messages[], createdAt, title (auto-generated from first message) }`
- History list sorted by most recent first
- Consider exporting conversation history as a feature
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/chat/ConversationHistory.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | History preserved in session | Integration | Send messages, verify conversation appears in history list |
| TC-02 | Clicking history item restores conversation | Unit | Click history entry, verify messages restored in chat panel |
| TC-03 | New Query clears current and adds to history | Integration | Click "+ New Query", verify current conversation saved to history and chat cleared |
| TC-04 | Relative timestamps shown | Unit | Render conversation from 5 min ago, verify "5 min ago" text |
| TC-05 | Max 50 conversations | Integration | Add 51 conversations, verify only 50 retained |
| TC-06 | Sorted by most recent | Unit | Render 3 conversations, verify most recent appears first |
