# SA-404: Onboarding Info Cards

## User Story
**As a** new user,
**I want to** see contextual information about how the tool works and its capabilities,
**so that** I understand the value proposition before starting my first analysis.

## Priority
P1 — High

## Figma Reference
- **Screen**: Main Dashboard ([`1:2`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-2))
- **Component**: "How it works" card ([`1:27`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-27))
- **Component**: "Current Capabilities" card ([`1:37`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-37))

## Design Specifications
- Two cards stacked vertically in the right column of the bento layout:
  - **"How it works"** card:
    - Lightbulb icon (blue circle background) + "How it works" heading (H4)
    - Description text: "Our AI agent crawls your site, extracts technical metadata, and cross-references it with modern web standards to provide a prioritized list of improvements."
    - Light background, subtle border, rounded corners
  - **"Current Capabilities"** card:
    - "Current Capabilities" heading + decorative sparkle icon (top-right)
    - Checklist of 3 items with green check circle icons:
      - Web Vitals Diagnostic
      - Semantic HTML Audit
      - Content Strategy Analysis
    - Slightly different background tint (subtle blue/gray) for visual distinction

## Acceptance Criteria
- [ ] Both cards display correctly in the right column of the dashboard bento layout
- [ ] "How it works" card has the lightbulb icon and clear descriptive text
- [ ] "Current Capabilities" card shows a checklist with green check icons
- [ ] Cards have consistent border radius, padding, and shadow treatment
- [ ] Cards are not interactive (informational only) but may link to Help in the future
- [ ] Content is static for now but should be easily updatable (driven by config/CMS later)

## Technical Notes
- Implement as presentational React components
- Capability list could be data-driven from a config array for easy updates
- Consider hiding these cards after the user's first completed analysis (progressive disclosure)
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/components/OnboardingCards.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | How It Works card renders with lightbulb icon | Unit | Asserts the "How it works" heading and lightbulb icon are present |
| TC-02 | Current Capabilities checklist renders 3 items | Unit | Verifies the checklist contains Web Vitals, Semantic HTML, and Content Strategy items |
| TC-03 | Green check icons on capability items | Unit | Asserts each checklist item is preceded by a green check circle icon |
| TC-04 | Cards have consistent Tailwind styling | Unit | Verifies both cards have correct `rounded`, `shadow`, and padding classes applied |
| TC-05 | Cards are non-interactive | Unit | Asserts no click handlers or link roles are present on the card elements |
