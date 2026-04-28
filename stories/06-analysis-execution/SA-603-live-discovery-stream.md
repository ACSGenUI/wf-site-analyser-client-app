# SA-603: Live Discovery Stream

## User Story
**As a** user watching an analysis run,
**I want to** see pages and resources being discovered in real-time,
**so that** I can verify the crawl is finding the right content.

## Priority
P1 — High

## Figma Reference
- **Screen**: Analysis in Progress ([`1:824`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-824))
- **Component**: Live Discovery Stream panel ([`1:886`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-886))

## Design Specifications
- Panel heading: "LIVE DISCOVERY STREAM" with red dot "Live" indicator
- Feed of discovered items, each showing:
  - Page/link icon (blue circle with link icon)
  - URL path (truncated if long): e.g., "/pricing-tiers/enterprise-solutions"
  - Type badge: "PAGE" or "RESOURCE" (muted label)
  - Status badge: "SCANNED" (green) or "PROCESSING" (amber/yellow)
- Items appear from top, pushing older items down (reverse chronological)
- Blue left border accent on the currently processing item

## Acceptance Criteria
- [ ] Discovered pages/resources appear in real-time as the crawler finds them
- [ ] Each entry shows the URL path, type (PAGE/RESOURCE), and status (SCANNED/PROCESSING/ERROR)
- [ ] New entries animate in smoothly (slide-in or fade-in)
- [ ] The feed auto-scrolls to show the latest entries unless the user has scrolled up
- [ ] "Live" indicator pulses/animates to show real-time activity
- [ ] Clicking a URL entry could open it in an external browser (future feature)
- [ ] Feed has a maximum visible height with internal scrolling
- [ ] Error entries show in red with the error reason

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Feed items arrive via WebSocket/SSE events from the backend crawler
- Implement virtual scrolling (e.g., `@tanstack/react-virtual`) if list grows large (100+ items)
- Buffer incoming items and batch-render every 200ms to avoid UI thrashing
- Store feed data in local state for the session; not persisted
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/LiveDiscoveryStream.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Feed items appear via WebSocket mock | Integration | Emit mock WebSocket event, verify new entry renders in feed |
| TC-02 | New entries animate in | Unit | Add entry, verify CSS transition/animation class applied |
| TC-03 | Auto-scroll to latest | Unit | Add multiple entries, verify scroll position is at bottom |
| TC-04 | Live indicator pulses | Unit | Verify "Live" badge has `animate-pulse` Tailwind class |
| TC-05 | Error entries show red | Unit | Render entry with ERROR status, verify red badge/border applied |
| TC-06 | Feed has max-height with scroll | Unit | Render 20+ items, verify container has `max-h-*` class and `overflow-y-auto` |
| TC-07 | User scroll pauses auto-scroll | Integration | Scroll up manually, add new entry, verify scroll position stays |
