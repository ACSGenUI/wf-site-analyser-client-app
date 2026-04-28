# SA-606: Agent Workflow Controls

## User Story
**As a** user running an analysis,
**I want to** be able to pause or stop the analysis,
**so that** I have control over the running workflow and can manage resources.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Analysis in Progress ([`1:824`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-824))
- **Component**: Bottom floating bar — "AGENT WORKFLOW ACTIVE" + "PAUSE TASK" ([`1:1079`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1079))

## Design Specifications
- Fixed bottom bar spanning the content area:
  - Green dot + "AGENT WORKFLOW ACTIVE" text (left side)
  - "PAUSE TASK" button (right side, outlined/secondary style)
- Bar has a semi-transparent or solid background with subtle top border/shadow
- When paused: dot turns amber, text changes to "WORKFLOW PAUSED", button changes to "RESUME TASK"

## Acceptance Criteria
- [ ] Bottom bar is always visible during an active analysis (fixed position)
- [ ] Green dot indicator pulses subtly to show the workflow is active
- [ ] "PAUSE TASK" sends a pause command to the backend and updates UI state
- [ ] Paused state shows amber indicator and "RESUME TASK" button
- [ ] A "Cancel Analysis" option is available (possibly via a dropdown or secondary action)
- [ ] Cancellation asks for confirmation before stopping the workflow
- [ ] After cancellation, partial results are preserved and viewable
- [ ] Controls are keyboard accessible (Escape to cancel, Space to pause/resume)

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Pause/resume commands sent via IPC to main process → backend workflow engine
- Cancellation should gracefully stop all running agents and save partial state
- Bottom bar positioned with Tailwind `fixed bottom-0` classes, should not overlap main content scrolling area
- Use **Zustand** global store to track workflow status across components
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/WorkflowControls.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Bottom bar visible during analysis | Unit | Render with active workflow, verify bar is present with `fixed` positioning |
| TC-02 | Green dot indicator renders | Unit | Verify green dot element with `bg-green-500` class |
| TC-03 | Pause sends IPC command | Integration | Click "PAUSE TASK", verify IPC pause command invoked |
| TC-04 | Paused state shows amber + Resume | Unit | Set status to "paused", verify amber dot and "RESUME TASK" button text |
| TC-05 | Cancel asks confirmation | Integration | Click cancel option, verify confirmation dialog renders |
| TC-06 | Partial results preserved | Integration | Cancel workflow, verify partial results are saved to store |
| TC-07 | Keyboard accessible | Unit | Press Space on pause button, verify it triggers pause action |
