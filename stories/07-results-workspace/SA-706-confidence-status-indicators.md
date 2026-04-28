# SA-706: Confidence & Status Indicators

## User Story
**As a** user,
**I want** clear confidence scores and status indicators throughout the results,
**so that** I can trust the analysis quality and identify areas of uncertainty.

## Priority
P1 — High

## Figma Reference
- **Screen**: Results Workspace ([`1:158`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158))
- **Component**: Confidence badge ([`1:164`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-164) — "98.2% CONFIDENCE")
- **Component**: Block type status dots in the table

## Design Specifications
- **Confidence badge**: Rounded pill shape, green background/border, check icon + percentage + "CONFIDENCE" label
- **Status dots**: Small colored circles next to block types in the table
- **Color system**:
  - Green (>90%): High confidence, reliable
  - Amber (70–90%): Moderate confidence, review recommended
  - Red (<70%): Low confidence, manual verification needed
  - Blue: Informational/categorization indicator (not confidence-related)

## Acceptance Criteria
- [ ] Overall confidence score is displayed prominently in the page summary
- [ ] Individual blocks may have their own confidence/completeness indicators
- [ ] Color coding is consistent and follows the defined system
- [ ] Hovering over a confidence badge shows a tooltip with breakdown
- [ ] Low-confidence results are visually distinct to prompt user review
- [ ] Confidence is calculated based on data completeness, crawl success rate, and analysis coverage
- [ ] Status dots in the block table use consistent, accessible colors with labels for colorblind users

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Confidence calculation happens on the backend post-analysis
- Factors: pages crawled vs expected, extraction success rate, screenshot quality, template matching score
- Use `aria-label` on colored indicators for accessibility
- Color classes: green → `bg-green-500`, amber → `bg-amber-500`, red → `bg-red-500`
- Consider adding a legend/key explaining the color system
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/components/ConfidenceIndicators.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Confidence badge renders correct color | Unit | Pass 95%, verify green; pass 80%, verify amber; pass 50%, verify red |
| TC-02 | Status dots use accessible colors | Unit | Verify each dot element has `aria-label` attribute |
| TC-03 | Hover tooltip shows breakdown | Unit | Hover confidence badge, verify tooltip with factor breakdown appears |
| TC-04 | Low-confidence visually distinct | Unit | Pass 45%, verify red badge with warning icon |
| TC-05 | Aria-label set on indicators | Unit | Verify all colored indicators have descriptive `aria-label` values |
| TC-06 | Consistent color coding | Unit | Render multiple indicators, verify same thresholds produce same colors |
