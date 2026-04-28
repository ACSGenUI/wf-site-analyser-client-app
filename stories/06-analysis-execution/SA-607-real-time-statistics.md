# SA-607: Real-Time Statistics

## User Story
**As a** user monitoring an analysis,
**I want to** see key metrics like active agents, elapsed time, and infrastructure status,
**so that** I have a complete picture of the analysis operation.

## Priority
P1 — High

## Figma Reference
- **Screen**: Analysis in Progress ([`1:824`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-824))
- **Component**: Stat cards — Agents Active, Elapsed Time ([`1:872`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-872))
- **Component**: Infrastructure Status — Cloud Cluster ([`1:882`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-882))

## Design Specifications
- Two compact stat cards side by side:
  - **Agents Active**: Globe icon, "12" large number, "AGENTS ACTIVE" label
  - **Elapsed Time**: Clock icon, "04:12" large number, "ELAPSED TIME" label
- Infrastructure status card below:
  - Network/cluster icon, "STABLE" green badge
  - "Cloud Cluster" title, "Node 4" detail
  - "INFRASTRUCTURE STATUS" label

## Acceptance Criteria
- [ ] Active agent count updates in real-time as agents are spawned/completed
- [ ] Elapsed time counts up from analysis start (MM:SS format, HH:MM:SS for long analyses)
- [ ] Infrastructure status shows the current processing node and stability indicator
- [ ] Stat values animate when they change (number transition effect)
- [ ] All stats are prominently displayed alongside the workflow card
- [ ] Status badge colors: green = STABLE, amber = DEGRADED, red = ERROR

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Elapsed time should use `setInterval` (1s) for the timer, with `useEffect` cleanup
- Agent count and infrastructure status come from the backend real-time event stream
- Infrastructure status may not be relevant for all deployment models; hide if not applicable
- Badge colors use Tailwind: `bg-green-100 text-green-800`, `bg-amber-100 text-amber-800`, `bg-red-100 text-red-800`
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/RealTimeStats.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Agent count updates live | Integration | Emit mock event with count 12, verify "12" renders in agents card |
| TC-02 | Elapsed time counts up | Unit | Render and advance timers by 5s, verify "00:05" displayed |
| TC-03 | Infrastructure status shows correct badge | Unit | Pass "STABLE" status, verify green badge with `bg-green-100` class |
| TC-04 | Stat values animate on change | Unit | Change count from 10 to 12, verify number transition animation |
| TC-05 | Green/amber/red badge colors | Unit | Render STABLE, DEGRADED, ERROR states, verify correct Tailwind color classes |
| TC-06 | Long analysis shows HH:MM:SS | Unit | Advance timer to 3661s, verify "01:01:01" format |
