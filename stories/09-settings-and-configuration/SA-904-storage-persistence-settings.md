# SA-904: Storage & Persistence Settings

## User Story
**As a** user,
**I want to** configure data retention and storage policies,
**so that** I can manage my local storage footprint and data lifecycle.

## Priority
P1 — High

## Figma Reference
- **Screen**: Settings & Configuration ([`1:618`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-618))
- **Component**: Storage tab content

## Design Specifications
- Tab heading: "Storage" + description "Control your local and cloud data footprint."
- **Data Persistence** card:
  - Cloud icon (blue circle background)
  - "Data Persistence" label
  - Dropdown: "30 Days (Standard Retention)" as default
- **Warning banner** (below):
  - Amber/orange left border
  - Warning triangle icon
  - "Upcoming Limit Change" heading (bold)
  - Description: "Starting next month, standard retention will be capped..."
  - Banner has light amber background

## Acceptance Criteria
- [ ] Data Persistence dropdown offers options: 7 Days, 14 Days, 30 Days (default), 90 Days, Unlimited
- [ ] Warning banners appear for important policy changes or storage limits
- [ ] Current storage usage is displayed (e.g., "2.3 GB of 10 GB used")
- [ ] A "Clear Data" button allows users to purge old analysis data
- [ ] Confirmation dialog before any data deletion
- [ ] Storage settings apply to both analysis results and conversation history
- [ ] Separate retention can be set for different data types (future enhancement)

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Storage location: `app.getPath('userData')` on both Windows and macOS
- Warning banner styled with Tailwind `border-l-4 border-amber-500 bg-amber-50`
- Implement a background cleanup service that runs on app launch
- Display storage metrics by calculating the size of the data directory via IPC
- Warning banners can be driven by a server-side config for policy announcements
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/settings/StorageSettings.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Retention dropdown renders options | Unit | Open dropdown, verify 7/14/30/90/Unlimited options present |
| TC-02 | Warning banner renders with amber border | Unit | Verify banner element with `border-l-4 border-amber-500` classes |
| TC-03 | Current storage usage displayed | Integration | Mock IPC storage size response, verify "2.3 GB of 10 GB used" text |
| TC-04 | Clear Data shows confirmation | Unit | Click "Clear Data", verify confirmation dialog renders |
| TC-05 | Confirmation required before deletion | Integration | Click "Clear Data", confirm, verify IPC delete command invoked |
