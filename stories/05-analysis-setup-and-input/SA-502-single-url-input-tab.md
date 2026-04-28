# SA-502: Single URL Input Tab

## User Story
**As a** user,
**I want to** enter a single website URL and configure crawl parameters,
**so that** I can run a focused analysis on a specific site or page.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: New Analysis Setup ([`1:419`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-419))
- **Component**: Tab — "Single URL" ([`1:431`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-431), active)
- **Component**: Tab Content ([`1:440`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-440))

## Design Specifications
- Active tab: "Single URL" with blue bottom border indicator
- Form fields:
  - "Primary Entry Point" label + URL input field with globe icon prefix, placeholder "https://example.com/landing-page"
  - Helper text: "Standard analysis includes deep-crawl up to 3 levels from this root."
  - "Crawl Depth" dropdown: "Standard (3 levels)" default with chevron
  - "Device Emulation" segmented toggle: "Desktop" (with monitor icon) | "Mobile" (with phone icon)
- Info box at bottom: lightbulb icon + "Notice" heading + tip text about crawl budget optimization
- URL input has a visible border with focus state (blue border on focus)

## Acceptance Criteria
- [ ] URL input validates format on blur (must be a valid URL with protocol)
- [ ] Invalid URLs show red border and error message below
- [ ] Crawl Depth dropdown offers options: Shallow (1 level), Standard (3 levels), Deep (5 levels), Custom
- [ ] Device Emulation toggle switches between Desktop and Mobile with visual feedback
- [ ] Info box provides contextual tips relevant to the selected configuration
- [ ] Tab content transitions smoothly when switching between tabs
- [ ] Placeholder text is visible and helpful

## Validation Rules
| Field | Rule |
|-------|------|
| URL | Required, valid URL format, must include protocol (https://) |
| Crawl Depth | Required, default "Standard (3 levels)" |
| Device Emulation | Required, default "Desktop" |

## States
| State | Behavior |
|-------|----------|
| Empty | Placeholder text visible, helper text shown |
| Filled | URL displayed, validation passes, estimate updates |
| Error | Red border, error message below field |
| Focused | Blue border highlight on active field |

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- URL validation with **Zod** schema (`z.string().url()`)
- Use **Radix UI** Select primitive with **Tailwind CSS** styling for Crawl Depth dropdown
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/analysis/SingleUrlTab.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | URL input validates format on blur | Unit | Blur with invalid value, verify `border-red-500` class and error message |
| TC-02 | Valid URL shows no error | Unit | Enter `https://example.com`, blur, verify no error state |
| TC-03 | Crawl Depth dropdown renders options | Unit | Open dropdown, verify Shallow/Standard/Deep/Custom options present |
| TC-04 | Device Emulation toggle switches | Unit | Click Mobile segment, verify active state applies filled background class |
| TC-05 | Info box renders contextual tip | Unit | Verify lightbulb icon and notice text are present |
| TC-06 | Tab has active blue border | Unit | Verify active tab element has `border-blue-600` bottom border class |
| TC-07 | Placeholder text visible | Unit | Verify input placeholder is "https://example.com/landing-page" |
