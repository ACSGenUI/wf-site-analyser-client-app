# SA-201: Force Update Modal

## User Story
**As a** user running an outdated version of the app,
**I want to** see a clear, blocking update notification with release details,
**so that** I understand why I must update and can do so with one click.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Force Update Required ([`1:1193`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1193))
- **Component**: Update modal card (centered overlay)
- **Component**: Background dimmed dashboard ([`1:1194`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1194))

## Design Specifications
- Full-screen overlay: dimmed background with grain texture, main app UI visible but inaccessible
- Centered modal card (~400px wide) with:
  - Top row: "SYSTEM UPDATE" outlined badge (left) + "STATUS: ● Ready to Install" indicator (right)
  - Large heading: "Update Required"
  - Body text explaining the mandatory nature of the update
  - Version comparison: current → new version with arrow, using monospaced font for version numbers
  - Release notes section (see SA-203)
  - Footer: estimated update time text ("Approximate update time: 45 seconds. Your work will be saved.") + primary "Restart and Update Now" button
- Modal has no close button — user cannot dismiss it
- Sidebar and header remain visible but dimmed behind the overlay

## Acceptance Criteria
- [ ] Modal appears as a blocking overlay when a mandatory update is detected
- [ ] User cannot interact with any app content behind the modal (pointer events disabled)
- [ ] Modal displays current version, new version, and a clear visual arrow between them
- [ ] "Restart and Update Now" button triggers the update and restart process
- [ ] User's in-progress work (unsaved analysis, drafts) is auto-saved before restart
- [ ] An estimated update duration is shown to set expectations
- [ ] Status badge shows real-time update state: "Ready to Install", "Downloading...", "Installing..."
- [ ] If the update download fails, show an error state with a retry option
- [ ] The modal cannot be closed, dismissed, or bypassed via keyboard shortcuts

## Technical Notes
- Use Electron's `autoUpdater` module or `electron-updater` for the update lifecycle
- Implement IPC communication between main process (updater) and renderer (modal UI)
- Auto-save should use the same persistence layer as normal saves
- Version comparison should use semantic versioning (semver) parsing
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## States
| State | Behavior |
|-------|----------|
| Ready to Install | Default state — update downloaded, ready to apply |
| Downloading | Progress bar shown, button disabled, "Downloading..." status |
| Installing | Button shows spinner, "Installing..." status |
| Error | Error message with retry button |
| Restarting | Brief "Restarting..." message before app closes |

## Test Cases

**Test File**: `src/renderer/__tests__/components/ForceUpdateModal.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Renders when mandatory update detected | Unit | Modal appears in the DOM when a mandatory update flag is set |
| TC-02 | Blocks background interaction | Unit | Overlay disables pointer-events on all content behind the modal |
| TC-03 | Shows version comparison | Unit | Modal displays current and new version numbers with a visual arrow between them |
| TC-04 | CTA triggers IPC update | Integration | Clicking "Restart and Update Now" invokes the IPC update handler in the main process |
| TC-05 | Auto-saves before restart | Integration | In-progress work is persisted to the data layer before the restart process begins |
| TC-06 | Shows error state with retry | Unit | When the update download fails, an error message and retry button are displayed |
| TC-07 | Cannot be dismissed via Escape | Unit | Pressing the Escape key does not close or dismiss the modal |
| TC-08 | Status badge updates state | Unit | Status badge text changes through "Ready to Install", "Downloading...", and "Installing..." states |
