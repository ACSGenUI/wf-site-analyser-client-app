# SA-701: Results Split Layout

## User Story
**As a** user reviewing analysis results,
**I want** a split-screen layout with results on the left and AI chat on the right,
**so that** I can browse results while asking questions about them simultaneously.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Results Workspace & RAG Chat ([`1:158`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158))
- **Component**: Overall split layout structure

## Design Specifications
- Split layout: Left panel (~70% width) for structured results, Right panel (~30% width) for RAG chat
- Left panel: Scrollable vertically, contains all result sections stacked
- Right panel: Fixed chat interface with header, message area, and input (see Epic 07)
- Vertical divider between panels (subtle border)
- Both panels have independent scroll contexts
- Main content area is right of the 240px sidebar and below the 64px header

## Acceptance Criteria
- [ ] Split layout renders correctly with proper proportions (~70/30)
- [ ] Left panel scrolls independently from the right chat panel
- [ ] Layout is responsive: at narrower widths, consider stacking or collapsing the chat panel
- [ ] Divider between panels may be draggable to resize (nice-to-have)
- [ ] Chat panel can be collapsed/expanded to give more room to results
- [ ] Both panels maintain their scroll position independently
- [ ] URL reflects the current project/analysis for bookmarking and deep linking

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Use Tailwind CSS Grid (`grid grid-cols-[7fr_3fr]`) for the split layout
- Consider `resize: horizontal` on the divider for user-adjustable widths
- Right panel should be the same AI Assistant component used in other screens (Epic 08)
- Route: `/projects/:projectId/results/:analysisId`
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/results/ResultsSplitLayout.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Split layout renders ~70/30 proportions | Unit | Verify left panel and right panel render with correct Tailwind grid classes |
| TC-02 | Left panel scrolls independently | Unit | Scroll left panel, verify right panel scroll position unchanged |
| TC-03 | Right panel shows chat | Unit | Verify chat panel component renders in right column |
| TC-04 | Divider renders between panels | Unit | Verify border/divider element between left and right panels |
| TC-05 | Chat panel can collapse/expand | Unit | Click collapse trigger, verify right panel hides; click expand, verify it returns |
| TC-06 | Both panels maintain scroll position | Integration | Scroll both panels, collapse/expand chat, verify scroll positions preserved |
| TC-07 | URL reflects current project | Integration | Render with projectId and analysisId, verify URL matches route pattern |
