# SA-403: Dashboard Empty State

## User Story
**As a** new user visiting the dashboard for the first time,
**I want to** see a welcoming empty state with a clear call-to-action,
**so that** I understand how to get started with my first analysis.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Main Dashboard — Empty State ([`1:2`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-2))
- **Component**: Welcome Header ([`1:4`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-4))
- **Component**: Empty State Central Action ([`1:9`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-9))

## Design Specifications
- Welcome header: "Welcome to your Workspace" (H1, ~32px) + descriptive paragraph underneath
- Central action area uses a two-column bento layout:
  - Left column (~57% width): Large card with subtle shadow, containing:
    - "PRECISION ANALYSIS" badge (blue outline, uppercase, small)
    - "Start New Analysis" (H2, ~36px bold)
    - Description paragraph about RAG-enhanced AI audit
    - "Launch AI Agent" primary button (blue fill, white text, rocket icon)
    - Decorative background illustration (magnifying glass motif, faded)
  - Right column (~43% width): Two stacked info cards (see SA-304)
- Content area has 48px padding from sidebar edge

## Acceptance Criteria
- [ ] Empty state is shown when user has no existing projects or analyses
- [ ] "Welcome to your Workspace" heading is prominent and readable
- [ ] "Launch AI Agent" button navigates to the New Analysis Setup screen
- [ ] Layout adapts gracefully to different window sizes (min 1280px width)
- [ ] Empty state transitions to a project list view once the user has completed analyses
- [ ] Decorative background illustration does not interfere with text readability

## Technical Notes
- Dashboard layout uses Tailwind grid utilities for the two-column bento arrangement
- Empty state vs project list determined by data presence in global store
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## States
| State | Behavior |
|-------|----------|
| First Visit | Full empty state with welcome message and onboarding |
| Has Projects | Transitions to project list / recent analyses view |
| Loading | Skeleton placeholders for card areas |

## Test Cases

**Test File**: `src/renderer/__tests__/features/dashboard/DashboardEmptyState.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Welcome heading renders | Unit | Asserts "Welcome to your Workspace" heading is present and visible |
| TC-02 | Launch AI Agent button navigates | Integration | Clicks "Launch AI Agent" and verifies navigation to `/analysis/new` |
| TC-03 | Bento layout renders two columns | Unit | Asserts the two-column grid layout with correct Tailwind width ratios |
| TC-04 | Skeleton loading state renders | Unit | Renders in loading state and asserts skeleton placeholder elements are visible |
| TC-05 | Transitions to project list when projects exist | Integration | Provides project data to the store and asserts the empty state is replaced by a project list |
