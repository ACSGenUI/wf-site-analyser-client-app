# SA-303: Local Data Persistence

## User Story
**As a** guest user,
**I want** my projects, analysis history, and outputs to persist locally between sessions,
**so that** I don't lose my work when I close and reopen the app.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Settings & Configuration ([`1:618`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-618))
- **Component**: Storage section — Data Persistence setting

## Design Specifications
- Settings screen shows a "Storage" section with "Data Persistence" configuration
- Dropdown showing retention period: "30 Days (Standard Retention)"
- Warning banner for upcoming limit changes: amber left-border card with warning icon
- Storage usage indicator showing current disk usage

## Acceptance Criteria
- [ ] All user data (projects, analysis configs, results, chat history) persists in local storage
- [ ] Data survives app restarts and OS reboots
- [ ] Users can configure data retention period in Settings (default: 30 days)
- [ ] A warning is shown when storage approaches configured limits
- [ ] Local data is stored in the platform-appropriate app data directory
- [ ] Data can be manually exported or cleared from Settings
- [ ] Storage location: `app.getPath('userData')` on both macOS and Windows
- [ ] When IMS auth is added (Epic 10), a data migration/merge flow will be triggered

## Technical Notes
- Use `electron-store` for simple key-value config (settings, session state)
- Use `better-sqlite3` (via main process IPC) for structured data (projects, analysis history, chat)
- Store large artifacts (screenshots, reports) as files on disk with DB references
- Implement a background cleanup job for expired data based on retention policy
- Encrypt sensitive data at rest using Electron's `safeStorage`
- Database schema should include a `userId` column to support future multi-user migration
- Expose storage operations via typed IPC: `storage:get`, `storage:set`, `storage:query`, `storage:clear`
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## States
| State | Behavior |
|-------|----------|
| Healthy | Storage usage indicator shows normal levels |
| Warning | Amber banner when approaching 80% of retention limit |
| Full | Red warning, prompt to clean up or increase limit |
| (Future) Migrating | Progress indicator during guest → authenticated data merge (Epic 10) |

## Test Cases

**Test File**: `src/renderer/__tests__/auth/LocalDataPersistence.test.ts`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Data persists after mock restart | Integration | Saves data, simulates app restart, and verifies data is still retrievable |
| TC-02 | Retention period configurable | Unit | Changes the retention setting and confirms the new value is stored correctly |
| TC-03 | Warning shown at 80% capacity | Unit | Mocks storage usage at 80% and asserts the amber warning banner renders |
| TC-04 | Data stored in correct app directory | Integration | Verifies storage operations target the `app.getPath('userData')` directory |
| TC-05 | Storage operations work via IPC | Integration | Invokes `storage:get`, `storage:set`, and `storage:query` IPC channels and verifies responses |
| TC-06 | SQLite query returns saved data | Integration | Inserts a record via `better-sqlite3` IPC and retrieves it successfully |
