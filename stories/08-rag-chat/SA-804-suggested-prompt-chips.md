# SA-804: Suggested Prompt Chips

## User Story
**As a** user unfamiliar with what to ask,
**I want** suggested prompts to help me get started,
**so that** I can quickly get useful insights without composing questions from scratch.

## Priority
P1 — High

## Figma Reference
- **Screen**: Results Workspace ([`1:158`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158))
- **Component**: Suggested prompt chips above chat input ([`1:391`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-391))

## Design Specifications
- Horizontal row of chip-style buttons above the chat input area:
  - "Summarize layout strategy" — outlined chip, clickable
  - "Export JSON" — outlined chip, clickable
- Chips have rounded corners, subtle border, consistent padding
- Clicking a chip sends the prompt as a message automatically
- Chips may be contextual (different prompts on different screens)

## Acceptance Criteria
- [ ] 2–4 suggested prompts are displayed above the chat input area
- [ ] Clicking a chip sends the prompt text as a user message and triggers an AI response
- [ ] Prompts are contextual to the current screen:
  - Results workspace: "Summarize layout strategy", "Export JSON", "Compare templates", "List accessibility issues"
  - Analysis setup: "Recommend crawl settings", "Explain template detection", "Optimize for e-commerce"
  - Analysis progress: "Analyze site structure", "Check accessibility gaps"
- [ ] Chips disappear after one is clicked (or remain for repeated use — configurable)
- [ ] Chips are keyboard accessible and have focus/hover states

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Prompts defined as a static config map keyed by screen/context
- Chip styling: `border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500`
- Consider making prompts dynamic based on analysis results
- Chip click handler: insert text into chat, trigger send, scroll to response
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/chat/SuggestedPrompts.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | 2-4 chips displayed above input | Unit | Render on results screen, verify 2-4 chip elements present |
| TC-02 | Clicking chip sends prompt | Integration | Click "Summarize layout strategy" chip, verify message sent to chat |
| TC-03 | Prompts are contextual per screen | Unit | Render on setup screen, verify setup-specific prompts; on results, verify results-specific |
| TC-04 | Chips keyboard accessible | Unit | Tab to chip, press Enter, verify action triggered |
| TC-05 | Focus/hover states apply Tailwind classes | Unit | Focus chip, verify `focus:ring-2 focus:ring-blue-500` classes; hover, verify `hover:bg-gray-100` |
