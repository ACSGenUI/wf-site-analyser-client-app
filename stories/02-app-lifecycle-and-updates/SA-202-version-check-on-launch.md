# SA-202: Version Check on Launch

## User Story
**As a** system administrator,
**I want** the app to check for mandatory updates every time it launches,
**so that** users are always running a supported and secure version.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Force Update Required ([`1:1193`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1193))
- **Component**: Version display in sidebar ([`1:1225`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1225) — "V2.4.0")

## Design Specifications
- Version number displayed at the bottom of the left sidebar navigation: "V2.4.0"
- On the sign-in screen, version and environment info shown in bottom metadata bar

## Acceptance Criteria
- [ ] App checks for updates against the update server on every launch
- [ ] If a mandatory update is available, the Force Update Modal (SA-201) is shown immediately
- [ ] If an optional update is available, a subtle notification appears in the header (non-blocking)
- [ ] If the update server is unreachable, allow the user to proceed with a warning toast
- [ ] Version check includes a minimum supported version check (server-defined)
- [ ] Current version is always visible in the sidebar footer
- [ ] Periodic background checks occur every 30 minutes while the app is running

## Technical Notes
- Update check endpoint: `GET /api/v1/updates/check?version={current}&platform={os}`
- Response should include: `{ latestVersion, minimumVersion, mandatory, releaseNotes[], downloadUrl }`
- Cache the update manifest locally for offline comparison
- Implement exponential backoff for failed checks
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## States
| State | Behavior |
|-------|----------|
| Checking | Splash screen or subtle loading indicator during check |
| Up to Date | Normal app launch, no interruption |
| Optional Update | Non-blocking notification in header area |
| Mandatory Update | Blocking Force Update Modal (SA-201) |
| Check Failed | Warning toast, user can proceed |

## Test Cases

**Test File**: `src/renderer/__tests__/features/updates/VersionCheck.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Checks update server on launch | Integration | App sends a version check request to the update server during startup |
| TC-02 | Shows force modal for mandatory update | Integration | Force Update Modal (SA-201) is displayed when the server returns a mandatory update |
| TC-03 | Shows toast for optional update | Unit | A non-blocking notification toast appears when an optional update is available |
| TC-04 | Proceeds with warning if server unreachable | Unit | App shows a warning toast and continues loading when the update server is unreachable |
| TC-05 | Version displayed in sidebar | Unit | Current app version string is rendered in the sidebar footer |
| TC-06 | Periodic check fires every 30 min | Unit | A background timer triggers a version check every 30 minutes while the app is running |
