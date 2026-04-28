# SA-203: Release Notes Display

## User Story
**As a** user updating the app,
**I want to** see what's changed in the new version,
**so that** I understand the value of the update and any changes that affect my workflow.

## Priority
P1 — High

## Figma Reference
- **Screen**: Force Update Required ([`1:1193`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1193))
- **Component**: Release Notes section within the update modal

## Design Specifications
- "RELEASE NOTES" section label in uppercase, muted color
- List of 3 release note items, each with:
  - Left icon (contextual: gear/shield/sparkle icons for features/security/UI)
  - Bold title: e.g., "Enhanced RAG Engine", "Security Patch 2024.12", "UI Precision Alignment"
  - Description text below title in muted color
- Clean vertical spacing between items
- Items are stacked vertically within the modal card

## Acceptance Criteria
- [ ] Release notes are fetched from the update server along with version info
- [ ] Each note displays a category icon, title, and description
- [ ] Notes are categorized (feature, security, UI/UX, bugfix) with appropriate icons
- [ ] If more than 3–4 notes exist, the section becomes scrollable with a max-height
- [ ] Release notes support basic formatting (bold, links) in descriptions
- [ ] Empty release notes gracefully hide the section

## Technical Notes
- Release notes data structure: `{ icon: string, title: string, description: string, category: "feature" | "security" | "ui" | "bugfix" }`
- Render markdown in descriptions using a safe renderer (no script execution)
- Icons should map to categories: feature → gear, security → shield, ui → sparkle, bugfix → wrench
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/components/ReleaseNotes.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Renders release notes from server data | Unit | Component renders a list of release notes with titles and descriptions from API response |
| TC-02 | Shows category icons per note | Unit | Each note displays the correct icon mapped to its category (feature, security, UI, bugfix) |
| TC-03 | Scrollable when many notes | Unit | Section becomes scrollable with a max-height when more than 3–4 notes are present |
| TC-04 | Supports markdown in descriptions | Unit | Bold text, links, and other markdown formatting render correctly in note descriptions |
| TC-05 | Hides section when empty | Unit | Release notes section is not rendered when the notes array is empty |
