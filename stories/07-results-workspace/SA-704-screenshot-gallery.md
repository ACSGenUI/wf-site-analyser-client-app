# SA-704: Screenshot Gallery

## User Story
**As a** user,
**I want** a gallery of screenshots captured during the analysis,
**so that** I can visually review the pages and compare them.

## Priority
P1 — High

## Figma Reference
- **Screen**: Results Workspace ([`1:158`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158))
- **Component**: Screenshots Gallery section ([`1:267`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-267))

## Design Specifications
- "Screenshots Gallery" section heading with "View All" blue link (right-aligned)
- Horizontal row of 5 screenshot thumbnails
- Each thumbnail: rounded corners, consistent aspect ratio (~4:3 or 16:9), subtle border
- Thumbnails show page content previews (dark/professional looking screenshots)
- Horizontal scroll or overflow hidden with "View All" for full gallery

## Acceptance Criteria
- [ ] Screenshots are displayed as thumbnails in a horizontal row
- [ ] Clicking a thumbnail opens a lightbox/modal with the full-size screenshot
- [ ] "View All" opens a full gallery view with all captured screenshots
- [ ] Lightbox supports navigation between screenshots (left/right arrows)
- [ ] Screenshots show the page URL or title as a label on hover
- [ ] If no screenshots were captured, show an appropriate empty state
- [ ] Thumbnails lazy-load for performance

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Screenshots captured during analysis execution phase (SA-605)
- Stored as PNG/JPEG files in the local app data directory
- Implement a lightbox component with keyboard navigation (arrow keys, Escape to close) using **Radix UI** Dialog
- Thumbnail generation: resize to ~300px width, maintain aspect ratio
- Lazy loading with `loading="lazy"` attribute on `<img>` elements
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/results/ScreenshotGallery.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Thumbnails render in horizontal row | Unit | Pass 5 screenshots, verify 5 thumbnail images in flex row |
| TC-02 | Clicking thumbnail opens lightbox | Unit | Click first thumbnail, verify lightbox/modal renders with full-size image |
| TC-03 | View All link renders | Unit | Verify "View All" link element is present |
| TC-04 | Lightbox supports left/right navigation | Unit | Open lightbox, click right arrow, verify next image shown |
| TC-05 | Empty state when no screenshots | Unit | Pass empty array, verify empty state message |
| TC-06 | Thumbnails lazy-load | Unit | Verify `loading="lazy"` attribute on thumbnail `<img>` elements |
| TC-07 | Lightbox closes on Escape | Unit | Open lightbox, press Escape, verify modal closed |
