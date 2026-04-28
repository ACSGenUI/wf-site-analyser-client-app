# SA-703: Artifacts Download Panel

## User Story
**As a** user,
**I want to** download generated artifacts from the analysis,
**so that** I can use the reports, schemas, and screenshots in my own tools and presentations.

## Priority
P1 — High

## Figma Reference
- **Screen**: Results Workspace ([`1:158`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158))
- **Component**: Artifacts card ([`1:228`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-228))

## Design Specifications
- "ARTIFACTS" section heading in uppercase, muted text
- Card with three downloadable items, each showing:
  - File type icon: code braces for JSON, document for PDF, image for PNG
  - File name: "Schema.json", "SEO_Report.pdf", "Full_Page.png"
  - Download icon (cloud/arrow-down) on the right
- Each row is clickable to initiate download
- Subtle dividers between items
- Card has border and rounded corners

## Acceptance Criteria
- [ ] All generated artifacts are listed with appropriate file type icons
- [ ] Clicking a row or download icon initiates a native file save dialog
- [ ] Files are downloaded to the user's chosen location (or default Downloads folder)
- [ ] Download progress is shown for larger files
- [ ] If an artifact failed to generate, it shows a disabled state with explanation
- [ ] File sizes are displayed next to file names
- [ ] Artifacts list is dynamically generated based on what the analysis produced

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Use Electron's `dialog.showSaveDialog` via IPC for native save location picker
- Artifacts are stored locally in the app's data directory after analysis
- Support formats: JSON, PDF, PNG, CSV, HTML
- Consider a "Download All" button as a zip archive
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/results/ArtifactsPanel.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | All artifacts listed with file icons | Unit | Pass 3 artifacts, verify 3 rows with correct file type icons |
| TC-02 | Clicking row triggers save dialog | Integration | Click artifact row, verify IPC `dialog:showSaveDialog` invoked |
| TC-03 | Disabled state for failed artifacts | Unit | Pass artifact with `failed` status, verify disabled/grayed-out styling |
| TC-04 | File sizes displayed | Unit | Verify each row shows file size (e.g., "2.4 MB") |
| TC-05 | Dynamically generated from output | Integration | Pass analysis output, verify artifact list matches generated files |
| TC-06 | Download progress shown | Unit | Mock large file download, verify progress indicator visible |
