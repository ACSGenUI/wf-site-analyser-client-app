# SA-507: Resource Estimate Panel

## User Story
**As a** user configuring an analysis,
**I want to** see a real-time estimate of the resources and time required,
**so that** I can make informed decisions about my analysis scope.

## Priority
P1 — High

## Figma Reference
- **Screen**: New Analysis Setup ([`1:419`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-419))
- **Component**: Quick Stats Card ([`1:492`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-492))

## Design Specifications
- Card in the right sidebar column with:
  - "Resource Estimate" heading (H3)
  - Token usage progress bar with label (e.g., "Tokens" left, value right like "~12,400")
  - Description text about estimation basis
  - Two metric rows below a horizontal divider:
    - Est. Pages: icon + label + value (e.g., "~45 pages")
    - Est. Duration: icon + label + value (e.g., "~8 minutes")
  - Metrics use a two-column layout with icon, label (small), and value (medium)

## Acceptance Criteria
- [ ] Resource estimate updates dynamically as the user changes input and configuration
- [ ] Token usage shows a progress bar with estimated token count
- [ ] Estimated page count reflects crawl depth and input type
- [ ] Estimated duration reflects current configuration complexity
- [ ] Estimates update with a brief loading/calculating animation
- [ ] Values show "~" prefix to indicate approximation
- [ ] Warning state if estimated resources exceed account limits

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Estimation calculated client-side using heuristics based on input type, crawl depth, and historical averages
- Debounce estimate recalculation (300ms) to avoid excessive updates
- Token estimate should account for: crawl tokens + analysis tokens + RAG indexing tokens
- Progress bar styled with Tailwind `bg-blue-600` fill and `bg-gray-200` track
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/ResourceEstimate.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Estimate updates on input change | Integration | Change URL input, verify estimate values re-render |
| TC-02 | Token progress bar renders | Unit | Verify progress bar with `bg-blue-600` fill class |
| TC-03 | Page/duration estimates show ~ prefix | Unit | Verify values display "~45 pages" and "~8 minutes" format |
| TC-04 | Debounced recalculation | Unit | Rapidly change inputs, verify recalculation fires only after 300ms |
| TC-05 | Warning state for exceeded limits | Unit | Set estimate above threshold, verify warning banner appears |
| TC-06 | Metric rows render correctly | Unit | Verify icon + label + value layout for Est. Pages and Est. Duration |
