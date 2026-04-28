# SA-402: Top Header Bar

## User Story
**As a** user,
**I want** a top header bar showing the current context, sync status, and account info,
**so that** I always know where I am and the state of my session.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Main Dashboard ([`1:2`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-2))
- **Component**: Header — TopNavBar ([`1:99`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-99))

## Design Specifications
- Fixed top bar, 64px height, spans the width of the main content area (right of sidebar)
- Left section: "Site Analyzer" title + session badge ("LOCAL SESSION" with green dot for guests)
- Center/right section: Active project name as blue link ("Project Alpha")
- Right section (grouped): Cloud sync icon + "Syncing" text | Notification bell icon | User profile avatar (32×32 circle)
- Clean bottom border separating header from content
- Typography: App name in semi-bold, project name in blue medium weight

## Acceptance Criteria
- [ ] Header appears on all authenticated screens
- [ ] Current project name is displayed and clickable (navigates to project overview)
- [ ] Sync status indicator shows real-time state with appropriate icon
- [ ] Notification bell is clickable and shows unread count badge
- [ ] User avatar shows profile image (authenticated) or placeholder (guest)
- [ ] "LOCAL SESSION" badge appears for guest users, hidden for authenticated users
- [ ] Header content updates reactively when context changes (e.g., switching projects)

## Technical Notes
- Header should be part of the app shell layout alongside the sidebar
- Use a global state/context for project name and sync status
- Avatar component should handle image loading errors gracefully
- Consider breadcrumb-style navigation for nested screens (e.g., "Site Analyzer > New Analysis")
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/components/HeaderBar.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Header renders with app name | Unit | Asserts "Site Analyzer" text is present in the header |
| TC-02 | Project name clickable and navigates | Integration | Clicks the project name link and verifies navigation to the project overview |
| TC-03 | Sync status indicator displays | Unit | Renders header with sync state and asserts the sync icon and text are visible |
| TC-04 | Notification bell clickable | Unit | Clicks the notification bell and verifies the click handler fires |
| TC-05 | User avatar renders | Unit | Asserts the avatar element (image or placeholder) is present in the header |
| TC-06 | LOCAL SESSION badge shown for guest | Unit | Renders header in guest mode and asserts "LOCAL SESSION" badge is visible |
| TC-07 | Header appears on all authenticated routes | Integration | Navigates to Dashboard, Projects, and Settings routes and asserts the header is rendered |
