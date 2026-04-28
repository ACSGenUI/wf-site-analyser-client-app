# SA-601: Analysis Progress Dashboard

## User Story
**As a** user who has started an analysis,
**I want** a comprehensive dashboard showing the overall progress and status,
**so that** I can monitor the analysis without guessing what's happening.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Analysis in Progress ([`1:824`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-824))
- **Component**: Active Workflow card ([`1:837`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-837))
- **Component**: Overall layout and progress bar

## Design Specifications
- Header shows project name "Project Alpha" with "RUNNING" green badge
- "Analysis in Progress" heading with description paragraph
- Linear blue progress bar below the description (represents overall % completion)
- Active Workflow card:
  - "ACTIVE WORKFLOW" blue badge (top-left)
  - Workflow title: "Deep Scan: site-alpha.com" (large heading)
  - Circular percentage indicator: "68%" with "OVERALL COMPLETION" label
  - Card has subtle shadow and rounded corners
- Below workflow card: Live Discovery Stream and Detected Stack panels

## Acceptance Criteria
- [ ] Dashboard shows overall completion percentage in both the progress bar and circular indicator
- [ ] Progress updates in real-time via WebSocket/SSE from the backend
- [ ] Workflow title reflects the actual analysis target URL or project name
- [ ] "RUNNING" badge in header updates to reflect workflow state (Running, Paused, Completed, Failed)
- [ ] Screen transitions smoothly from setup screen after "Begin Analysis" is clicked
- [ ] If the user navigates away and returns, the progress state is preserved
- [ ] Completed analysis automatically transitions to Results Workspace (Epic 06)

## States
| State | Behavior |
|-------|----------|
| Running | Blue progress bar animating, "RUNNING" badge, active step indicator |
| Paused | Yellow/amber badge, progress bar paused, "Resume" button visible |
| Completed | Green badge, 100% progress, auto-navigate to results (3s delay) |
| Failed | Red badge, error message, retry option |

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Real-time updates via WebSocket/SSE events from backend
- Route: `/analysis/:id/progress`
- Circular percentage indicator built with SVG `stroke-dasharray`/`stroke-dashoffset`
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/ProgressDashboard.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Shows overall completion percentage | Unit | Render with 68% progress, verify progress bar and circular indicator show "68%" |
| TC-02 | Progress bar animates | Unit | Verify progress bar has Tailwind `transition-all` or CSS animation class |
| TC-03 | RUNNING badge in header | Unit | Verify green badge with "RUNNING" text renders |
| TC-04 | Transitions from setup screen | Integration | Click Begin Analysis on setup, verify navigation to progress dashboard |
| TC-05 | Preserves state on navigate-away | Integration | Navigate away and back, verify progress state is maintained |
| TC-06 | Auto-navigates to results on completion | Integration | Set progress to 100%, verify redirect to results route after delay |
| TC-07 | Badge reflects workflow state | Unit | Render with "Paused" state, verify amber badge with "PAUSED" text |
