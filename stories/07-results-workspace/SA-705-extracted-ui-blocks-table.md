# SA-705: Extracted UI Blocks Table

## User Story
**As a** user,
**I want** a structured table of all extracted UI blocks from the analysis,
**so that** I can review, filter, and inspect individual components of the analyzed site.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Results Workspace ([`1:158`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158))
- **Component**: Extracted UI Blocks table ([`1:304`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-304))

## Design Specifications
- "Extracted UI Blocks" section heading
- Data table with columns:
  - **ID**: Block identifier (e.g., "#BLOCK_01") in monospace
  - **BLOCK TYPE**: Type with colored status dot — blue (Hero Section), green (Feature Grid), amber (Pricing Table)
  - **ATTRIBUTES**: Comma-separated list of component attributes (e.g., "H1, Button, Background Video")
  - **ACTION**: External link / inspect icon
- Alternating row backgrounds or subtle hover state
- Clean table borders and consistent column widths
- Status dots: blue = layout/hero, green = content/grid, amber = conversion/pricing

## Acceptance Criteria
- [ ] Table displays all extracted UI blocks with ID, type, attributes, and action
- [ ] Block type includes a colored status dot indicating the category
- [ ] Clicking the action icon opens a detail view for that block
- [ ] Table supports sorting by any column
- [ ] Table supports filtering by block type
- [ ] Empty table state shown if no blocks were extracted
- [ ] Block IDs are unique and formatted consistently (#BLOCK_XX)
- [ ] Attributes are truncated with "..." if too long, with full list in tooltip

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Block data comes from the analysis output (block extraction step)
- Color coding maps: layout → `bg-blue-500`, content → `bg-green-500`, conversion → `bg-amber-500`, navigation → `bg-purple-500`
- Detail view as a side drawer using **Radix UI** Sheet primitive with **Tailwind CSS** styling
- Consider adding a search input above the table for quick filtering
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/results/UiBlocksTable.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Table renders columns | Unit | Verify ID, BLOCK TYPE, ATTRIBUTES, ACTION column headers present |
| TC-02 | Block type has colored status dot | Unit | Render Hero block, verify blue dot with `bg-blue-500` class |
| TC-03 | Sorting by column works | Unit | Click TYPE header, verify rows reorder alphabetically |
| TC-04 | Filtering by block type works | Unit | Select "Hero Section" filter, verify only hero rows visible |
| TC-05 | Empty table state | Unit | Pass empty blocks array, verify empty state message |
| TC-06 | Action icon opens detail view | Unit | Click action icon, verify detail drawer/modal opens |
| TC-07 | Attributes truncated with tooltip | Unit | Pass long attributes string, verify ellipsis and tooltip on hover |
