# SA-505: Figma Input Tab

## User Story
**As a** designer or developer,
**I want to** connect a Figma file for design system analysis,
**so that** I can audit component consistency and design-to-code alignment.

## Priority
P2 — Medium

## Figma Reference
- **Screen**: New Analysis Setup ([`1:419`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-419))
- **Component**: Tab — "Figma Input" ([`1:437`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-437))

## Design Specifications
- Tab label: "Figma Input"
- When active, tab content shows:
  - Figma URL input field with Figma icon prefix
  - Placeholder: "https://figma.com/design/..."
  - "Connect" button to authenticate and fetch file metadata
  - After connection: file name, page count, component count preview
  - Option to select specific pages or frames for analysis

## Acceptance Criteria
- [ ] Input accepts Figma file URLs and validates the format
- [ ] "Connect" button initiates Figma API authentication if not already connected
- [ ] After connection, file metadata (name, pages, components) is displayed
- [ ] User can select specific pages or frames to include in the analysis
- [ ] Invalid Figma URLs show descriptive error messages
- [ ] Connection errors (auth failed, file not found) are handled gracefully
- [ ] Previously connected Figma files are remembered for quick re-selection

## States
| State | Behavior |
|-------|----------|
| Empty | URL input with placeholder and Connect button |
| Connecting | Loading spinner on Connect button |
| Connected | File metadata card with page/frame selector |
| Error | Red border, error message (auth failed, invalid URL, etc.) |

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Figma URL validation with regex for `figma.com/design/` or `figma.com/file/` patterns
- Figma API authentication handled via IPC to main process
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/FigmaInputTab.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Figma URL input validates format | Unit | Enter invalid URL, verify error state with `border-red-500` |
| TC-02 | Connect button triggers auth | Integration | Click Connect with valid URL, verify IPC auth call invoked |
| TC-03 | Metadata displayed after connection | Integration | Mock successful auth, verify file name and page count shown |
| TC-04 | Invalid URL shows error | Unit | Enter non-Figma URL, verify descriptive error message |
| TC-05 | Loading state on connect | Unit | Click Connect, verify spinner renders on button |
| TC-06 | Connection error handled | Integration | Mock auth failure, verify error message and retry option |
| TC-07 | Previously connected files remembered | Integration | Connect file, remount, verify file appears in recent list |
