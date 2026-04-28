# SA-508: AI Assistant Setup Guide

## User Story
**As a** user unfamiliar with analysis configuration,
**I want** an AI assistant to help me configure my analysis,
**so that** I can get optimal settings without being an expert.

## Priority
P2 — Medium

## Figma Reference
- **Screen**: New Analysis Setup ([`1:419`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-419))
- **Component**: Aside — NavigationDrawer ([`1:555`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-555))

## Design Specifications
- Right-side drawer panel (320px wide):
  - Header: "AI Assistant" heading + "RAG Interface" subtitle + close (X) button
  - Horizontal border below header
  - Chat area with:
    - Assistant message bubble: "I'm ready to help you configure your analysis. Would you like me to recommend crawl settings based on your industry?"
    - Three suggested prompt buttons (outlined, full-width):
      - "Recommend crawl settings..."
      - "Explain template detection..."
      - "Optimize for e-commerce..."
  - Bottom section with horizontal border:
    - Chat input: "Ask AI Assistant..." placeholder + blue send button (arrow icon)
    - "+ New Query" outlined button below

## Acceptance Criteria
- [ ] AI Assistant drawer is toggled via a button in the header or a dedicated trigger
- [ ] Drawer slides in from the right with smooth animation
- [ ] Suggested prompts are clickable and populate the chat with the selected prompt
- [ ] User can type custom questions in the chat input
- [ ] Assistant responses reference the current analysis configuration
- [ ] "+ New Query" clears the conversation and starts fresh
- [ ] Drawer can be closed with the X button or Escape key
- [ ] Drawer does not overlap the main form content (pushes or overlays appropriately)

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- AI Assistant uses the same RAG chat infrastructure as the results workspace
- Context should include current form state (selected tab, URL, configuration)
- Implement as a slide-over drawer component with React portal rendering and Tailwind `translate-x` transitions
- Store conversation in local session state (not persisted long-term)
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/AiAssistantDrawer.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Drawer opens from trigger | Unit | Click trigger button, verify drawer is visible with `translate-x-0` |
| TC-02 | Drawer slides in with animation | Unit | Verify transition classes are applied during open/close |
| TC-03 | Suggested prompts clickable | Unit | Click prompt button, verify chat input populated with prompt text |
| TC-04 | Chat input accepts text | Unit | Type in input field, verify value updates |
| TC-05 | New Query clears conversation | Integration | Send message, click "+ New Query", verify chat history cleared |
| TC-06 | Close via X button | Unit | Click X, verify drawer closes |
| TC-07 | Close via Escape key | Unit | Press Escape, verify drawer closes |
| TC-08 | Drawer does not overlap form | Unit | Open drawer, verify main form content is still accessible |
