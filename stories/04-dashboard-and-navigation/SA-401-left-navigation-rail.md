# SA-401: Left Navigation Rail

## User Story
**As a** user,
**I want** a persistent left sidebar with clear navigation options,
**so that** I can quickly move between Dashboard, Projects, Settings, and Help sections.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Main Dashboard ([`1:2`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-2))
- **Component**: Aside — SideNavBar Rail ([`1:121`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-121))

## Design Specifications
- Fixed left sidebar, 240px wide, full viewport height
- Top section: App icon (blue rounded square with grid pattern) + "Site Analyzer" heading
- Navigation items (stacked vertically with 56px height each):
  - Dashboard (grid icon) — active state: blue text, blue left border accent, blue icon
  - Projects (folder icon) — inactive: muted gray text and icon
  - Settings (gear icon) — inactive style
  - Help (question-circle icon) — inactive style
- Bottom section: Version number "V2.4.0" in small muted text
- Subtle right border separating sidebar from main content
- Background: white/light with slight elevation or border

## Acceptance Criteria
- [ ] Sidebar is visible on all screens except the sign-in screen and force-update modal
- [ ] Active nav item shows blue highlight with left border accent
- [ ] Clicking a nav item navigates to the corresponding section
- [ ] Nav items show hover state (subtle background highlight)
- [ ] App version is displayed at the bottom of the sidebar
- [ ] Sidebar maintains its state (active item) based on current route
- [ ] Icons are consistent across active/inactive states (filled vs outlined or color change)

## Technical Notes
- Implement as a persistent layout component wrapping all authenticated routes
- Use React Router's `NavLink` for automatic active state management
- Sidebar should not scroll independently — all items should be visible
- Consider keyboard navigation (arrow keys to move between items)
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## States
| State | Behavior |
|-------|----------|
| Default | All items visible, current page highlighted |
| Hover | Subtle background highlight on hovered item |
| Active | Blue text, blue left border, blue/filled icon |
| Inactive | Gray text, gray icon, no border |

## Test Cases

**Test File**: `src/renderer/__tests__/components/SideNavRail.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Sidebar renders with all 4 nav items | Unit | Asserts Dashboard, Projects, Settings, and Help items are present |
| TC-02 | Active item shows blue highlight | Unit | Verifies the active nav item has `border-l-2 border-blue-600` classes applied |
| TC-03 | Clicking nav item navigates to correct route | Integration | Clicks each nav item and asserts the router location updates accordingly |
| TC-04 | Hover state applies background class | Unit | Simulates hover on a nav item and checks for the `bg-gray-100` Tailwind class |
| TC-05 | Version number displayed at bottom | Unit | Asserts a version string (e.g., "V2.4.0") renders at the sidebar bottom |
| TC-06 | Sidebar hidden on sign-in route | Integration | Renders on the `/sign-in` route and asserts the sidebar is not in the DOM |
| TC-07 | Keyboard navigation between items | Unit | Simulates arrow key presses and verifies focus moves between nav items |
