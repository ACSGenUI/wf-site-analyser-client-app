# SA-406: New Analysis Floating Action Button

## User Story
**As a** user on any screen,
**I want** a persistent floating action button to start a new analysis,
**so that** I can quickly initiate a new analysis from anywhere in the app.

## Priority
P1 — High

## Figma Reference
- **Screen**: Main Dashboard ([`1:2`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-2))
- **Component**: FAB button (bottom-right corner, [`1:156`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-156))

## Design Specifications
- Circular button (56×56px), positioned fixed at bottom-right of the main content area
- Blue primary fill with white "+" icon
- Subtle shadow for elevation
- Position: 24px from right edge, 24px from bottom edge

## Acceptance Criteria
- [ ] FAB is visible on the Dashboard and Projects screens
- [ ] FAB is hidden during active analysis (Analysis in Progress screen)
- [ ] Clicking the FAB navigates to the New Analysis Setup screen
- [ ] FAB has hover state (slight scale or shadow increase)
- [ ] FAB has a tooltip on hover: "New Analysis"
- [ ] FAB does not overlap with important content or scrollbar
- [ ] FAB uses smooth entrance animation (scale up from 0 on page load)

## Technical Notes
- Implement as a fixed-position component within the main content area layout
- Use CSS `position: fixed` with appropriate z-index
- Add `aria-label="Start new analysis"` for accessibility
- Consider hiding on smaller viewports if it overlaps with content
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/components/NewAnalysisFAB.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | FAB renders on Dashboard | Unit | Asserts the FAB button is present when rendering the Dashboard route |
| TC-02 | FAB hidden during active analysis | Integration | Renders the Analysis in Progress screen and asserts the FAB is not in the DOM |
| TC-03 | Click navigates to /analysis/new | Integration | Clicks the FAB and verifies navigation to the New Analysis Setup route |
| TC-04 | Hover shows tooltip "New Analysis" | Unit | Simulates hover on the FAB and asserts a tooltip with "New Analysis" text appears |
| TC-05 | FAB has correct Tailwind positioning | Unit | Verifies the FAB element has `fixed bottom-6 right-6` Tailwind classes applied |
| TC-06 | aria-label is set | Unit | Asserts `aria-label="Start new analysis"` is present on the FAB button element |
