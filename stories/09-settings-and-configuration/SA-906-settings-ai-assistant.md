# SA-906: Settings AI Assistant

## User Story
**As a** user configuring settings,
**I want** an AI assistant in the settings page to help me understand configuration options,
**so that** I can make informed decisions about my setup.

## Priority
P2 — Medium

## Figma Reference
- **Screen**: Settings & Configuration ([`1:618`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-618))
- **Component**: AI Assistant panel — right side of settings screen

## Design Specifications
- Right-side panel: "AI ASSISTANT" heading + "RAG Interface" subtitle + close (X) button
- Pro-tip card: blue left border, "PRO-TIP" label, helpful text about using OpenAI keys for high-precision audits or local model fallback
- Settings History section:
  - Clock icon + "SETTINGS HISTORY" label
  - List of recent setting changes: "API Key Rotation — 2 hours ago"
- "+ New Query" primary blue button at bottom

## Acceptance Criteria
- [ ] AI Assistant panel is accessible from the settings screen
- [ ] Pro-tip cards provide contextual guidance based on the active settings tab
- [ ] Settings history shows recent configuration changes with timestamps
- [ ] Users can ask the assistant questions about settings configuration
- [ ] Panel can be closed with the X button
- [ ] Pro-tips rotate or change based on what the user is configuring

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Settings history tracked locally: `{ action, timestamp, tab, field }`
- Pro-tips defined in a static config, filtered by active tab; styled with Tailwind `border-l-4 border-blue-500 bg-blue-50`
- AI Assistant uses the same chat infrastructure as other panels
- Context for the assistant: current settings values, validation errors, and active tab
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/settings/SettingsAiAssistant.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | AI Assistant panel opens | Unit | Click trigger, verify panel renders with "AI ASSISTANT" heading |
| TC-02 | Pro-tip card renders with blue border | Unit | Verify pro-tip element has `border-l-4 border-blue-500` classes |
| TC-03 | Settings history shows recent changes | Unit | Pass history entries, verify list renders with timestamps |
| TC-04 | Close via X button | Unit | Click X, verify panel closes |
| TC-05 | Contextual tips change per active tab | Integration | Switch to "Browser Settings" tab, verify pro-tip text updates |
