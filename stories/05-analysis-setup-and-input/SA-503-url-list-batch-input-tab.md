# SA-503: URL List Batch Input Tab

## User Story
**As a** power user,
**I want to** paste a list of multiple URLs for batch analysis,
**so that** I can analyze multiple pages or sites in a single run.

## Priority
P1 — High

## Figma Reference
- **Screen**: New Analysis Setup ([`1:419`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-419))
- **Component**: Tab — "URL List" ([`1:433`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-433))

## Design Specifications
- Tab label: "URL List" (inactive state: no bottom border, muted text)
- When active, tab content shows:
  - "URL List" label + textarea input (multi-line, ~8 rows)
  - Placeholder: "Enter one URL per line..."
  - URL count badge: "X URLs detected"
  - Same Crawl Depth and Device Emulation options as Single URL tab
  - Helper text about batch limits

## Acceptance Criteria
- [ ] Textarea accepts multiple URLs, one per line
- [ ] Real-time URL count displayed as a badge ("12 URLs detected")
- [ ] Each URL is individually validated; invalid ones highlighted with line numbers
- [ ] Maximum URL limit enforced (e.g., 100 URLs) with clear messaging
- [ ] Duplicate URLs are detected and flagged with option to deduplicate
- [ ] Empty lines and whitespace are ignored
- [ ] Paste support works correctly for bulk URL lists from spreadsheets

## Validation Rules
| Field | Rule |
|-------|------|
| URL List | At least 1 valid URL, max 100 URLs |
| Each URL | Valid URL format with protocol |
| Duplicates | Warn but allow, offer one-click dedup |

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- URL parsing and validation with line-by-line **Zod** schema
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/UrlListTab.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Textarea accepts multiple URLs | Unit | Paste 5 URLs, verify all render in textarea |
| TC-02 | URL count badge updates | Unit | Type 3 URLs, verify badge shows "3 URLs detected" |
| TC-03 | Invalid URLs flagged per line | Unit | Enter mix of valid/invalid URLs, verify invalid lines are highlighted |
| TC-04 | Max 100 URL limit enforced | Unit | Paste 101 URLs, verify error message about limit |
| TC-05 | Duplicates detected and flagged | Unit | Enter same URL twice, verify duplicate warning shown |
| TC-06 | Empty lines ignored | Unit | Enter URLs with blank lines between, verify count excludes blanks |
| TC-07 | Paste from spreadsheet works | Integration | Simulate paste event with tab-separated URLs, verify correct parsing |
