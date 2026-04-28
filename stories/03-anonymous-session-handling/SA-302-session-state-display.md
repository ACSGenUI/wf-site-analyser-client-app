# SA-302: Session State Display

## User Story
**As a** user (currently always in guest mode),
**I want to** see my session state clearly in the app header,
**so that** I always know I'm working in a local session.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Main Dashboard ([`1:2`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-2))
- **Component**: Header — session state area ([`1:107`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-107))
- **Component**: "LOCAL SESSION" badge ([`1:103`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-103))
- **Component**: User profile avatar placeholder ([`1:119`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-119))

## Design Specifications
- Top header bar shows: App name "Site Analyzer" | "LOCAL SESSION" badge | Project name link | Notification bell | Generic avatar
- "LOCAL SESSION" badge: Green dot indicator + "LOCAL SESSION" text on a subtle background pill
- Generic avatar placeholder (no profile image in guest mode)
- No sync/cloud status indicator in guest mode (will be added with IMS in Epic 10)

## Acceptance Criteria
- [ ] "LOCAL SESSION" green badge is always visible in the header during guest mode
- [ ] Badge has a green dot indicator and clear "LOCAL SESSION" text
- [ ] Generic avatar placeholder is shown (initials or generic icon)
- [ ] Clicking the avatar opens a minimal dropdown: "About", "Settings" (no sign-out in guest mode)
- [ ] Notification bell is present but may show empty state initially
- [ ] Session state is read from the global store and updates reactively
- [ ] When IMS auth is added (Epic 10), this component will swap the badge for sync status and a real avatar

## Technical Notes
- Session state component: `<SessionIndicator mode={session.mode} />`
- Badge component: reusable `<StatusBadge variant="local" />` 
- Avatar component: `<UserAvatar src={null} fallback="guest" />`
- Prepare the component API to accept authenticated session props in the future
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## States
| State | Behavior |
|-------|----------|
| Guest Mode | "LOCAL SESSION" green badge, generic avatar, no sync indicator |
| (Future) Authenticated | Profile avatar, sync status, org name — handled in Epic 10 |

## Test Cases

**Test File**: `src/renderer/__tests__/components/SessionIndicator.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | LOCAL SESSION badge renders in guest mode | Unit | Asserts the "LOCAL SESSION" badge is visible when session mode is `guest` |
| TC-02 | Green dot indicator visible | Unit | Verifies the green dot element renders alongside the badge text |
| TC-03 | Generic avatar placeholder shown | Unit | Confirms a generic avatar (initials or icon) renders when no profile image exists |
| TC-04 | Avatar dropdown shows About and Settings | Integration | Clicks the avatar and asserts the dropdown contains "About" and "Settings" items |
| TC-05 | Notification bell renders | Unit | Asserts the notification bell icon is present in the header area |
| TC-06 | Session state reads from global store | Integration | Updates the global store session mode and verifies the component re-renders accordingly |
