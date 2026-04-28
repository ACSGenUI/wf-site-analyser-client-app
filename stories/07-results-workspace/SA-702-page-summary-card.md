# SA-702: Page Summary Card

## User Story
**As a** user viewing analysis results,
**I want** a summary card showing the key findings and metrics for the analyzed page,
**so that** I get an immediate overview of the analysis output.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Results Workspace ([`1:158`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158))
- **Component**: Page Summary card ([`1:160`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-160))
- **Component**: Metric cards — DOM Depth, Interactive, Load Time ([`1:190`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-190))

## Design Specifications
- Summary card with:
  - "Page Summary" heading (H2)
  - Description: "Automated structural analysis for marketing landing page."
  - Confidence badge: "98.2% CONFIDENCE" with green check icon (top-right of card)
- Three inline metric cards below the summary:
  - "DOM DEPTH: 14 Levels" — nested layer icon
  - "INTERACTIVE: 22 Elements" — pointer/click icon
  - "LOAD TIME: 1.2s" — clock/speed icon
- Metric cards have subtle borders, consistent sizing, and centered content
- Summary card has elevated style (shadow + rounded corners)

## Acceptance Criteria
- [ ] Summary card displays analysis description and confidence score
- [ ] Confidence badge uses color coding: green (>90%), amber (70–90%), red (<70%)
- [ ] Three metric cards show DOM depth, interactive element count, and load time
- [ ] Metric values are pulled from the analysis output data
- [ ] Cards have a consistent height and alignment
- [ ] Values that couldn't be determined show "N/A" with a tooltip explaining why
- [ ] Clicking the confidence badge shows a breakdown of how confidence was calculated

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Metrics come from the analysis output JSON
- Confidence score is calculated by the backend based on crawl completeness, data quality, and analysis coverage
- Confidence badge colors: `bg-green-100 text-green-800` (>90%), `bg-amber-100 text-amber-800` (70-90%), `bg-red-100 text-red-800` (<70%)
- Use **Radix UI** Tooltip primitive with **Tailwind CSS** styling for metric tooltips
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/results/PageSummaryCard.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Summary card renders title and description | Unit | Verify "Page Summary" heading and description text present |
| TC-02 | Confidence badge green for >90% | Unit | Pass 98.2% confidence, verify green badge with `bg-green-100` class |
| TC-03 | Confidence badge amber for 70-90% | Unit | Pass 75% confidence, verify amber badge |
| TC-04 | Confidence badge red for <70% | Unit | Pass 55% confidence, verify red badge |
| TC-05 | Three metric cards render | Unit | Verify DOM Depth, Interactive, and Load Time cards present |
| TC-06 | N/A shown for missing values | Unit | Pass null metric, verify "N/A" text with tooltip |
| TC-07 | Clicking confidence shows breakdown | Unit | Click badge, verify popover with calculation breakdown |
