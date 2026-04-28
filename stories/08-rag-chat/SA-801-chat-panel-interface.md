# SA-801: Chat Panel Interface

## User Story
**As a** user viewing analysis results,
**I want** an integrated chat panel to ask questions about the analysis,
**so that** I can get AI-powered insights without leaving the results view.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Results Workspace ([`1:158`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158))
- **Component**: Chat panel — right side ([`1:359`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-359))

## Design Specifications
- Panel header: "ANALYZE WITH AI" heading with robot/AI icon + subtitle "Query the site extraction using RAG context."
- Message area (scrollable):
  - Assistant messages: left-aligned, light gray background bubbles, "SITE ASSISTANT" label above
  - User messages: right-aligned, blue background bubbles, "YOU" label above
  - Messages support inline reference chips (blue pills like [Template A1], [Block 12])
- Input area at bottom:
  - Text input: "Ask a question..." placeholder
  - Blue circular send button with arrow icon (right side)
- Bottom bar: attachment icon (paperclip) | refresh/retry icon | "● RAG ACTIVE" green status indicator
- Suggested prompt chips above the input area (see SA-704)

## Acceptance Criteria
- [ ] Chat panel is displayed in the right portion of the split layout
- [ ] Users can type messages and send via Enter key or send button
- [ ] Assistant responses stream in progressively (token by token) for better UX
- [ ] Messages are visually distinct: user (blue, right) vs assistant (gray, left)
- [ ] "RAG ACTIVE" indicator shows that the knowledge base is loaded and ready
- [ ] Attachment button allows uploading additional context (images, files) — future feature placeholder
- [ ] Refresh button clears the current message and retries
- [ ] Chat auto-scrolls to the latest message
- [ ] Empty state shows the panel header with suggested prompts

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Use server-sent events (SSE) for streaming assistant responses
- Messages rendered with markdown support (bold, code, lists) via `react-markdown`
- Reference chips parsed from special markers in the response (e.g., `[Block 12]`)
- User bubbles: `bg-blue-600 text-white`; Assistant bubbles: `bg-gray-100 text-gray-900`
- Chat state stored in component state; persisted to local storage for session continuity
- Input supports Shift+Enter for multiline messages
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/chat/ChatPanel.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Panel renders with header | Unit | Verify "ANALYZE WITH AI" heading and subtitle present |
| TC-02 | User messages right-aligned blue | Unit | Send message, verify bubble has `bg-blue-600` class and right alignment |
| TC-03 | Assistant messages left-aligned gray | Unit | Render assistant message, verify `bg-gray-100` class and left alignment |
| TC-04 | Enter key sends message | Unit | Type in input, press Enter, verify message added to chat |
| TC-05 | Streaming response renders progressively | Integration | Mock SSE stream, verify text appears token by token |
| TC-06 | RAG ACTIVE indicator shown | Unit | Verify green "RAG ACTIVE" badge in footer |
| TC-07 | Auto-scrolls to latest | Unit | Add multiple messages, verify scroll position at bottom |
| TC-08 | Empty state shows suggested prompts | Unit | Render with no messages, verify prompt chips visible |
