# SA-802: Source Citations & References

## User Story
**As a** user reading assistant responses,
**I want** inline citations referencing specific templates, blocks, and data points,
**so that** I can verify the information and navigate directly to the referenced content.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Results Workspace ([`1:158`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158))
- **Component**: Reference chips in chat messages — [Template A1], [Block 12] (inline blue pills)

## Design Specifications
- Inline reference chips within chat messages:
  - Blue pill/badge with text like "[Template A1]", "[Block 12]"
  - Slightly elevated or outlined style to distinguish from regular text
  - Clickable — navigates to or highlights the referenced item in the left results panel
- References appear in both user messages (when they mention blocks) and assistant responses
- Hex color values rendered inline with a color swatch: e.g., "#0265DC" with a small blue square

## Acceptance Criteria
- [ ] Assistant responses include inline reference chips for templates, blocks, and screenshots
- [ ] Clicking a reference chip scrolls to and highlights the referenced item in the results panel
- [ ] Reference chips are visually distinct from regular text (blue pill styling)
- [ ] Color values mentioned in responses show a preview swatch
- [ ] References are automatically detected and linked (not manually inserted)
- [ ] Invalid or missing references show a muted/disabled chip with a tooltip
- [ ] User messages that mention blocks/templates are also parsed for references

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Backend formats references using a convention like `[[type:id]]` (e.g., `[[block:12]]`, `[[template:A1]]`)
- Frontend parser converts these markers into clickable chip components styled with Tailwind `bg-blue-100 text-blue-800 rounded-full px-2 py-0.5`
- Clicking a chip dispatches a navigation event to the left panel (scroll-to-element + highlight)
- Color swatch: render a 12×12px inline square with the detected hex color
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/chat/SourceCitations.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Reference chips render as blue pills | Unit | Render message with `[[block:12]]`, verify chip with `bg-blue-100` class |
| TC-02 | Clicking chip scrolls to item | Integration | Click reference chip, verify scroll event dispatched to results panel |
| TC-03 | Color swatch renders for hex values | Unit | Render message with "#0265DC", verify 12×12 swatch element |
| TC-04 | Invalid references show disabled chip | Unit | Render `[[block:999]]` with no matching block, verify muted chip style |
| TC-05 | Markers parsed into chips | Unit | Verify `[[block:12]]` text is replaced with clickable chip component |
| TC-06 | User messages also parse references | Unit | Send user message with "[Block 12]", verify chip renders |
