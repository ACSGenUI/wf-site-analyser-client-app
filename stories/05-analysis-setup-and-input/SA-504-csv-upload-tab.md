# SA-504: CSV Upload Tab

## User Story
**As a** user with a large URL dataset,
**I want to** upload a CSV file containing URLs for batch analysis,
**so that** I can process high-volume datasets without manual entry.

## Priority
P1 — High

## Figma Reference
- **Screen**: New Analysis Setup ([`1:419`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-419))
- **Component**: Tab — "CSV Upload" ([`1:435`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-435))

## Design Specifications
- Tab label: "CSV Upload"
- When active, tab content shows:
  - Drag-and-drop upload zone with dashed border, cloud upload icon
  - "Drag & drop your CSV file here" primary text
  - "or click to browse" secondary text / link
  - Supported formats note: ".csv, .tsv — max 10MB"
  - After upload: file name, size, row count preview, and a "Remove" action
  - Column mapping UI if CSV has multiple columns

## Acceptance Criteria
- [ ] Drag-and-drop zone accepts CSV and TSV files
- [ ] Click-to-browse opens native file picker filtered to CSV/TSV
- [ ] File size limit enforced (10MB) with error message for oversized files
- [ ] After upload, show file name, size, detected row count, and preview of first 5 rows
- [ ] If CSV has multiple columns, allow user to select which column contains URLs
- [ ] Invalid file types show descriptive error message
- [ ] "Remove" button clears the uploaded file and resets to dropzone state
- [ ] Upload progress shown for larger files

## States
| State | Behavior |
|-------|----------|
| Empty | Dashed border dropzone with upload icon and instructions |
| Drag Over | Blue highlighted border, background tint change |
| Uploading | Progress indicator within dropzone |
| Uploaded | File info card with name, size, row count, remove action |
| Error | Red border, error message (wrong format, too large, etc.) |

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Dropzone implemented with `react-dropzone`, styled with Tailwind `border-dashed border-2` classes
- CSV/TSV parsing with `papaparse`
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/CsvUploadTab.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Dropzone renders with dashed border | Unit | Verify dropzone has `border-dashed` Tailwind class and upload icon |
| TC-02 | Drag-over highlights zone | Unit | Simulate dragover event, verify blue highlight border class applied |
| TC-03 | File size limit enforced | Unit | Drop a 15MB file, verify error message about 10MB limit |
| TC-04 | Uploaded file shows info | Integration | Drop valid CSV, verify file name, size, and row count displayed |
| TC-05 | Remove button resets state | Unit | Upload file then click Remove, verify dropzone returns to empty state |
| TC-06 | Invalid file type shows error | Unit | Drop a `.exe` file, verify descriptive error message |
| TC-07 | Column mapping UI appears | Integration | Upload multi-column CSV, verify column selector renders |
| TC-08 | Upload progress shown | Unit | Simulate large file upload, verify progress indicator is visible |
