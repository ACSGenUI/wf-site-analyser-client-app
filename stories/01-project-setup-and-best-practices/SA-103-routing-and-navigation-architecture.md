# SA-103: Routing & Navigation Architecture

## User Story
**As a** developer,
**I want** a well-defined routing architecture with layout shells,
**so that** navigation between screens is predictable, deep-linkable, and performant.

## Priority
P0 — Critical Path (Sprint 1)

## Design Specifications
- Routes map to the 7 Figma screens plus the new setup epic
- Persistent layout shell: Left sidebar + Top header wraps all authenticated routes
- Sign-in and Force Update screens render without the layout shell

## Acceptance Criteria
- [ ] Route table is defined covering all planned screens:
  - `/sign-in` — Sign In / Guest Mode (no shell)
  - `/` or `/dashboard` — Main Dashboard
  - `/analysis/new?source=url|csv|figma` — New Analysis Setup
  - `/analysis/:id/progress` — Analysis in Progress
  - `/projects/:projectId/results/:analysisId` — Results Workspace
  - `/settings/:tab` — Settings & Configuration
  - `/force-update` — Force Update Required (no shell, blocking)
- [ ] Layout shell component wraps authenticated routes with sidebar + header
- [ ] Route guards redirect unauthenticated users to `/sign-in` (when auth is implemented in Epic 09)
- [ ] Routes use code-splitting / lazy loading with `React.lazy` + `Suspense`
- [ ] Loading fallback shows a skeleton or spinner during chunk load
- [ ] Browser-style back/forward navigation works correctly in Electron
- [ ] 404 / unknown routes show a graceful "Not Found" page

## Technical Notes
- Use React Router v6+ with `createHashRouter` (Electron doesn't support `BrowserRouter`)
- Layout shell pattern: nested routes with `<Outlet />` inside the shell component
- Guard middleware: wrap protected routes in an `AuthGuard` component (stub for now, activate in Epic 09)
- Route constants should be defined in a shared `routes.ts` file to avoid magic strings
- Pre-connect the route structure to the sidebar nav active state logic
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Definition of Done
- [ ] All routes are navigable and render placeholder content
- [ ] Sidebar highlights the correct nav item for each route
- [ ] Lazy loading works — network tab shows chunked JS loads
- [ ] Direct navigation via hash URLs works (e.g., `#/settings/api-keys`)

## Test Cases

**Test File**: `src/renderer/__tests__/setup/routing.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | All routes render placeholder content | Integration | Navigating to each defined route renders the expected placeholder component |
| TC-02 | Sidebar highlights correct nav item | Integration | Active sidebar item matches the current route path after navigation |
| TC-03 | Lazy loading works | Integration | Route components are code-split and load chunks on demand via React.lazy |
| TC-04 | 404 route shows fallback | Unit | Navigating to an undefined path renders the "Not Found" page |
| TC-05 | Hash navigation works | E2E | Direct navigation via hash URLs (e.g., `#/settings/api-keys`) renders the correct page |
