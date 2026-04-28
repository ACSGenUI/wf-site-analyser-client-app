# SA-1004: Guest-to-Authenticated Data Migration

## User Story
**As a** guest user who later signs in,
**I want** my local data to be migrated to my authenticated account,
**so that** I don't lose the analyses and work I did in guest mode.

## Priority
P1 — High

## Figma Reference
- N/A — No specific Figma screen; this is a flow/dialog.

## Design Specifications
- After successful IMS sign-in, if local guest data exists, show a migration dialog:
  - "We found local data from your guest session"
  - Options: "Merge with Cloud Account" (primary) | "Discard Local Data" (secondary) | "Keep Separate" (tertiary)
  - Progress indicator during migration
- Merge should be non-destructive (cloud data is never overwritten, local data is added)

## Acceptance Criteria
- [ ] After signing in, detect if local guest data exists (projects, analyses, chat history)
- [ ] If local data found, show migration prompt before proceeding to Dashboard
- [ ] "Merge" uploads local data to the cloud account and tags it with the authenticated user ID
- [ ] "Discard" deletes local guest data after confirmation
- [ ] "Keep Separate" retains local data but does not merge (accessible only when switching to guest mode)
- [ ] Migration progress is shown with a progress indicator
- [ ] Migration errors are handled gracefully with retry option
- [ ] After migration, the anonymous UUID data is cleaned up

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Migration logic runs in main process via IPC: read local SQLite → transform → upload via API
- Use a transaction-safe approach: only delete local data after cloud confirm
- If cloud sync backend is not ready, stub the migration to just re-key local data with the authenticated user ID
- Progress indicator styled with Tailwind `bg-blue-600` progress bar
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/auth/DataMigration.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Migration dialog shown when local data exists | Integration | Sign in with existing guest data, verify migration dialog renders |
| TC-02 | Merge uploads local data via IPC | Integration | Click "Merge with Cloud Account", verify IPC upload call invoked |
| TC-03 | Discard deletes after confirmation | Integration | Click "Discard Local Data", confirm dialog, verify IPC delete called |
| TC-04 | Keep Separate retains local data | Integration | Click "Keep Separate", verify no delete or upload, dialog closes |
| TC-05 | Progress indicator during migration | Unit | Trigger merge, verify progress bar with `bg-blue-600` class renders |
| TC-06 | Error shows retry option | Unit | Mock migration error, verify error message with retry button |
| TC-07 | Anonymous UUID cleaned up after merge | Integration | Complete merge, verify IPC call to remove anonymous UUID |
