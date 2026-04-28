# SA-604: Detected Stack Panel

## User Story
**As a** user,
**I want to** see the technology stack detected on the analyzed site,
**so that** I understand the technical landscape of the target.

## Priority
P1 — High

## Figma Reference
- **Screen**: Analysis in Progress ([`1:824`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-824))
- **Component**: Detected Stack panel ([`1:945`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-945))

## Design Specifications
- Panel heading: "DETECTED STACK"
- Technology chips displayed in a flowing/wrapping layout:
  - Each chip: colored left indicator/icon + technology name + version
  - Examples: "R React 19.0" (blue), "T TailwindCSS" (teal), "A Adobe Analytics" (red), "N Next.js" (dark), "S Sentry" (purple)
- Chips have rounded corners, subtle border, and consistent padding
- Different colors/icons per technology category (framework, CSS, analytics, error tracking)

## Acceptance Criteria
- [ ] Detected technologies appear as chips as they are identified during crawling
- [ ] Each chip shows the technology name and version (if detected)
- [ ] Chips have category-appropriate colors or icons
- [ ] New chips animate in when detected (fade-in or slide-in)
- [ ] Chips wrap to multiple rows if many technologies are detected
- [ ] Clicking a chip could show more details about the detection (future feature)
- [ ] Common technologies are recognized: React, Vue, Angular, Next.js, Tailwind, Bootstrap, analytics tools, etc.

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Technology detection runs as part of the crawl step, analyzing HTML, JS bundles, and HTTP headers
- Detection results come via the same real-time event stream as other progress updates
- Chip colors mapped from a static config based on technology name, using Tailwind `bg-*` classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/DetectedStackPanel.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Technology chips render | Unit | Pass tech list, verify correct number of chip elements |
| TC-02 | Chips show name + version | Unit | Pass `{ name: "React", version: "19.0" }`, verify "React 19.0" text |
| TC-03 | New chips animate in | Unit | Add chip dynamically, verify fade-in/slide-in CSS transition |
| TC-04 | Chips wrap to multiple rows | Unit | Render 10+ chips, verify flex-wrap layout |
| TC-05 | Category-appropriate colors applied | Unit | Pass React tech, verify blue background class; pass Sentry, verify purple |
| TC-06 | Empty state when no techs | Unit | Pass empty array, verify placeholder or empty panel |
