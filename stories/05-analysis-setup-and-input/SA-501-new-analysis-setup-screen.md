# SA-501: New Analysis Setup Screen

## User Story
**As a** user,
**I want** a dedicated setup screen to configure my analysis parameters,
**so that** I can customize the scope and method before launching the AI workflow.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: New Analysis Setup ([`1:419`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-419))
- **Component**: Page Header ([`1:422`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-422))
- **Component**: Bento Layout Content ([`1:427`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-427))

## Design Specifications
- Header breadcrumb: "Site Analyzer > New Analysis" with ">" separator
- Page heading: "Setup New Analysis" (H1, large) with descriptive paragraph below
- Two-column bento layout:
  - Left column (~66%): Tabbed input form card with shadow and border
  - Right column (~33%): Stacked helper panels (Resource Estimate + Guide)
- Right edge: Collapsible AI Assistant drawer (320px)
- 48px content padding from sidebar

## Acceptance Criteria
- [ ] Screen is accessible via Dashboard CTA, data source cards, or FAB
- [ ] Page title and description are displayed prominently
- [ ] Two-column layout renders correctly at 1280px+ width
- [ ] Tab selection persists if user navigates away and returns (within session)
- [ ] AI Assistant drawer can be toggled open/closed
- [ ] "Begin Analysis" button is always visible without scrolling (sticky footer in form card)
- [ ] "Reset" action clears all form fields and resets to defaults

## Technical Notes
- Route: `/analysis/new` with optional query param `?source=url|csv|figma` to pre-select tab
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Use controlled form state with **React Hook Form** + **Zod** validation
- Implement autosave of form draft to local storage via IPC
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/AnalysisSetupScreen.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Screen accessible via Dashboard CTA | Integration | Navigate from Dashboard CTA, verify `/analysis/new` renders setup screen |
| TC-02 | Page title and description render | Unit | Verify H1 "Setup New Analysis" and descriptive paragraph are present |
| TC-03 | Two-column layout at 1280px+ | Unit | Assert left column (~66%) and right column (~33%) render with correct Tailwind grid classes |
| TC-04 | Tab selection persists in session | Integration | Select a tab, navigate away, return — verify same tab is active |
| TC-05 | AI Assistant drawer toggles | Unit | Click trigger button, verify drawer opens with `translate-x` animation; click X to close |
| TC-06 | Begin Analysis button always visible | Unit | Scroll form content, verify CTA remains sticky at bottom of form card |
| TC-07 | Reset clears all form fields | Integration | Fill form, click Reset, verify all fields return to default values |
| TC-08 | Query param pre-selects tab | Integration | Navigate to `/analysis/new?source=csv`, verify CSV tab is active |
