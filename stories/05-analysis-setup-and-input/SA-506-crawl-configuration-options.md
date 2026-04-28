# SA-506: Crawl Configuration Options

## User Story
**As a** technical user,
**I want to** fine-tune crawl depth, device emulation, and other parameters,
**so that** I can tailor the analysis scope to my specific needs.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: New Analysis Setup ([`1:419`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-419))
- **Component**: Crawl Depth dropdown ([`1:451`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-451))
- **Component**: Device Emulation toggle ([`1:461`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-461))
- **Component**: Info box / Notice ([`1:473`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-473))

## Design Specifications
- **Crawl Depth**: Dropdown select with label, showing "Standard (3 levels)" as default. Chevron icon on right.
- **Device Emulation**: Segmented button group with "Desktop" (monitor icon) and "Mobile" (phone icon). Active segment has filled background, inactive has outlined style.
- **Notice box**: Light background with left blue/green border, lightbulb icon, "Notice" heading, and helpful crawl tip text.

## Acceptance Criteria
- [ ] Crawl Depth dropdown offers: Shallow (1 level), Standard (3 levels), Deep (5 levels), Custom (user enters number)
- [ ] Device Emulation toggle switches between Desktop and Mobile
- [ ] Selected device affects the User-Agent and viewport used during crawling
- [ ] Notice box shows contextual tips based on current configuration
- [ ] Configuration changes trigger resource estimate recalculation (SA-407)
- [ ] All configuration values have sensible defaults
- [ ] Custom crawl depth shows a number input when selected

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Crawl depth affects the number of pages discovered and analysis duration
- Device emulation maps to Puppeteer/Playwright viewport and user-agent presets
- Use **Radix UI** Select and ToggleGroup primitives with **Tailwind CSS** styling
- Configuration should be serializable for saving as presets
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/CrawlConfig.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Crawl Depth dropdown renders 4 options | Unit | Open dropdown, verify Shallow/Standard/Deep/Custom options |
| TC-02 | Device Emulation toggles Desktop/Mobile | Unit | Click Mobile, verify active segment has filled background |
| TC-03 | Custom depth shows number input | Unit | Select Custom, verify number input field appears |
| TC-04 | Notice box renders contextual tips | Unit | Verify lightbulb icon and notice text are present |
| TC-05 | Config changes trigger estimate recalc | Integration | Change crawl depth, verify resource estimate component re-renders |
| TC-06 | All config values have defaults | Unit | Render component, verify Standard depth and Desktop emulation selected |
| TC-07 | Custom depth validates range | Unit | Enter 0, verify error; enter 10, verify accepted |
