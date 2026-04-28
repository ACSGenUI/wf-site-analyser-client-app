# SA-405: Data Source Selection Cards

## User Story
**As a** user,
**I want to** choose from multiple data source types (URL, CSV, Figma) directly from the dashboard,
**so that** I can quickly start an analysis using my preferred input method.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Main Dashboard ([`1:2`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-2))
- **Component**: Input Types Section ([`1:56`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-56))
- **Component**: URL Card ([`1:63`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-63)), CSV Card ([`1:75`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-75)), Figma Card ([`1:87`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-87))

## Design Specifications
- Section header: "Choose your data source" (H3) with a horizontal divider line extending to the right
- Three equal-width cards in a horizontal row:
  - **Website URL** card:
    - Blue globe icon in light blue circle background (48×48)
    - "Website URL" heading (H4)
    - "Enter a live URL for a real-time crawl and accessibility scoring." description
    - "START ANALYSIS >" link in blue uppercase with arrow chevron
  - **CSV Upload** card:
    - Orange/red CSV file icon in light background
    - "CSV Upload" heading
    - "Upload a batch of URLs to perform high-volume competitive analysis."
    - "UPLOAD FILE >" link
  - **Figma Link** card:
    - Purple Figma icon in light background
    - "Figma Link" heading
    - "Analyze design systems and component consistency from Figma."
    - "CONNECT DESIGN >" link
- Cards have subtle border, rounded corners, consistent padding (24px)

## Acceptance Criteria
- [ ] Three cards are displayed in an equal-width horizontal row
- [ ] Each card has a distinct icon, title, description, and action link
- [ ] Clicking a card or its action link navigates to the New Analysis Setup screen with the corresponding tab pre-selected
- [ ] Cards have hover state (subtle elevation or border change)
- [ ] Cards are responsive — stack vertically below certain breakpoints if needed
- [ ] Icons use consistent sizing (48×48 background circle, ~20px icon)

## Technical Notes
- Each card click should pass a parameter to the analysis setup route: `/analysis/new?source=url|csv|figma`
- Implement as a reusable `DataSourceCard` component
- Icons can be SVG components or icon library references
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/components/DataSourceCards.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Three cards render in horizontal row | Unit | Asserts three `DataSourceCard` elements are present in a flex/grid row layout |
| TC-02 | Each card has icon, title, description, link | Unit | Verifies each card contains the expected icon, heading, description text, and action link |
| TC-03 | Clicking URL card navigates correctly | Integration | Clicks the Website URL card and asserts navigation to `/analysis/new?source=url` |
| TC-04 | Clicking CSV card navigates correctly | Integration | Clicks the CSV Upload card and asserts navigation to `/analysis/new?source=csv` |
| TC-05 | Clicking Figma card navigates correctly | Integration | Clicks the Figma Link card and asserts navigation to `/analysis/new?source=figma` |
| TC-06 | Hover state applies elevation change | Unit | Simulates hover on a card and verifies a shadow or elevation Tailwind class is applied |
