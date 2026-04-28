# SA-605: Live Viewfinder

## User Story
**As a** user,
**I want to** see a live preview of what the crawler is currently viewing,
**so that** I have visual confirmation that the analysis is working correctly.

## Priority
P2 — Medium

## Figma Reference
- **Screen**: Analysis in Progress ([`1:824`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-824))
- **Component**: Live Viewfinder thumbnail area ([`1:993`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-993))

## Design Specifications
- Thumbnail-sized preview area showing the current browser state
- "LIVE VIEWFINDER" label below the thumbnail
- Camera/viewfinder icon overlay
- Dark background with rounded corners
- Updates periodically (every few seconds) with the current page screenshot

## Acceptance Criteria
- [ ] Viewfinder shows a thumbnail of the page currently being analyzed
- [ ] Image updates every 3–5 seconds during active crawling
- [ ] Clicking the viewfinder opens a larger preview modal
- [ ] Shows a placeholder state when between page loads
- [ ] Pauses updates when the analysis is paused
- [ ] Image quality is sufficient to see page layout but optimized for size

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Backend captures screenshots during crawling using Puppeteer/Playwright
- Screenshots sent as base64 thumbnails via WebSocket or fetched via polling
- Implement image crossfade transition between updates with Tailwind `transition-opacity`
- Thumbnail size: ~300×200px, actual capture at higher resolution
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/LiveViewfinder.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Thumbnail renders | Unit | Pass image src, verify `<img>` element renders with correct src |
| TC-02 | Image updates periodically | Integration | Mock interval, verify image src changes after 3-5 seconds |
| TC-03 | Click opens larger preview | Unit | Click thumbnail, verify modal/lightbox renders with full-size image |
| TC-04 | Placeholder shown between loads | Unit | Render without src, verify placeholder with camera icon |
| TC-05 | Pauses when analysis paused | Integration | Set workflow status to "paused", verify no new image updates |
| TC-06 | Crossfade transition on update | Unit | Update src, verify `transition-opacity` class applied |
