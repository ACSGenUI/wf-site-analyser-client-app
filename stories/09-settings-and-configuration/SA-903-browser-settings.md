# SA-903: Browser Settings

## User Story
**As a** technical user,
**I want to** configure how the analyzer's browser interacts with target websites,
**so that** I can control screenshot capture, JavaScript execution, and user agent settings.

## Priority
P1 — High

## Figma Reference
- **Screen**: Settings & Configuration ([`1:618`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-618))
- **Component**: Browser Settings tab content

## Design Specifications
- Tab heading: "Browser Settings" + description "Manage how the analyzer interacts with target websites."
- Toggle cards (horizontal layout):
  - **Screenshot Capture**: Toggle switch (ON = blue), title "Screenshot Capture", subtitle "Capture visual state on each step"
  - **JavaScript Execution**: Toggle switch, title "JavaScript Execution", subtitle "Enable JS execution during crawl"
- Toggle cards have subtle border, rounded corners, padding
- **USER AGENT** section: Dropdown with "Chrome (Desktop) - MacOS 14.2" as default value
- Dropdown styled with label "USER AGENT" in uppercase muted text

## Acceptance Criteria
- [ ] Screenshot Capture toggle enables/disables screenshot capture during analysis
- [ ] JavaScript Execution toggle enables/disables JS during crawling
- [ ] Toggles have clear ON (blue) and OFF (gray) visual states
- [ ] User Agent dropdown offers presets: Chrome Desktop, Chrome Mobile, Firefox, Safari, Custom
- [ ] Custom User Agent option shows a text input for manual entry
- [ ] Changes are applied to all future analyses (not retroactive)
- [ ] Toggle descriptions clearly explain what each setting controls
- [ ] Settings persist between sessions

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- These settings configure the Puppeteer/Playwright browser instance used during crawling
- Toggle ON state: `bg-blue-600`; OFF state: `bg-gray-300`
- Use **Radix UI** Switch primitive with **Tailwind CSS** styling for toggles
- User agent presets should match common real-world values
- Screenshot capture setting affects both the analysis step and the live viewfinder (SA-605)
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/settings/BrowserSettings.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Screenshot toggle renders ON/OFF | Unit | Verify toggle with `bg-blue-600` class when ON, `bg-gray-300` when OFF |
| TC-02 | JS execution toggle works | Unit | Click toggle, verify state changes and visual update |
| TC-03 | User agent dropdown shows presets | Unit | Open dropdown, verify Chrome Desktop, Chrome Mobile, Firefox, Safari, Custom options |
| TC-04 | Custom user agent shows text input | Unit | Select "Custom", verify text input field appears |
| TC-05 | Settings persist between sessions | Integration | Save settings, remount, verify saved values loaded via IPC |
