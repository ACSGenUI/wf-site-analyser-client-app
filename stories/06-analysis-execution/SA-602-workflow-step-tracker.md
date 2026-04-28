# SA-602: Workflow Step Tracker

## User Story
**As a** user monitoring an analysis,
**I want to** see each step of the workflow pipeline and its current status,
**so that** I know exactly which phase is active and how much is left.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Analysis in Progress ([`1:824`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-824))
- **Component**: Step tracker pipeline (horizontal stepper within the Active Workflow card)

## Design Specifications
- Horizontal step tracker with 5–6 steps connected by lines:
  - Each step: circle icon + label below + detail text
  - Completed steps: blue filled circle with white checkmark, connected by solid blue line
  - Active step: blue outline circle with spinning/loading icon, connected by solid blue line (left) and gray line (right)
  - Pending steps: gray outline circle, connected by gray dashed/solid lines
- Step labels and details:
  1. **CRAWLING** — "2,401 Nodes" (completed)
  2. **DISCOVERED PAGES** — "142 URL Paths" (completed)
  3. **TEMPLATE CLUSTERING** — "AI Grouping (82%)" (in progress)
  4. **BLOCK EXTRACTION** — "Waiting..." (pending)
  5. **SCREENSHOT CAPTURE** — "Pending" (pending)
- Steps are evenly distributed horizontally across the card width

## Acceptance Criteria
- [ ] Each step shows its name, current status, and relevant metric
- [ ] Completed steps display blue filled circles with checkmarks
- [ ] Active step shows an animated spinner/loading indicator
- [ ] Pending steps show gray outline circles
- [ ] Connecting lines reflect status: solid blue for completed, gray for pending
- [ ] Step metrics update in real-time (e.g., node count increases during crawling)
- [ ] Clicking a step could show more details in a tooltip or drawer (future enhancement)
- [ ] The tracker is responsive and doesn't overflow on standard desktop widths

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Step data structure: `{ id, label, status: "completed" | "active" | "pending", metric: string }`
- Use Tailwind `animate-spin` for active step spinner
- Step transitions animate smoothly (circle fill, line color change) with Tailwind transition classes
- Backend sends step status updates via the same real-time channel as overall progress
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/WorkflowStepTracker.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Renders all 5 steps | Unit | Verify 5 step elements with correct labels (CRAWLING, DISCOVERED PAGES, etc.) |
| TC-02 | Completed steps show blue check | Unit | Set step status to "completed", verify blue filled circle with checkmark icon |
| TC-03 | Active step shows spinner | Unit | Set step status to "active", verify `animate-spin` class on spinner element |
| TC-04 | Pending steps show gray circle | Unit | Set step status to "pending", verify gray outline circle renders |
| TC-05 | Step metrics update live | Integration | Update metric prop from "0 Nodes" to "2,401 Nodes", verify text changes |
| TC-06 | Connecting lines reflect status | Unit | Verify solid blue line between completed steps, gray line before pending |
| TC-07 | Responsive at standard widths | Unit | Render at 1280px, verify no horizontal overflow |
