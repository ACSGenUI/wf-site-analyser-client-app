# SA-901: Settings Navigation & Layout

## User Story
**As a** user,
**I want** a well-organized settings page with tabbed navigation,
**so that** I can easily find and modify different configuration areas.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Settings & Configuration ([`1:618`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-618))
- **Component**: Settings tab navigation (left side of settings content area)

## Design Specifications
- "SETTINGS" heading in the top header bar (bold, uppercase)
- Left vertical tab navigation within the settings content area:
  - "Model API Keys" (key icon) — active state: blue text, blue background tint, blue left border
  - "Browser Settings" (globe icon) — inactive: gray text and icon
  - "Storage" (cloud icon) — inactive
  - "Account" (user icon) — inactive
- Right content area changes based on selected tab
- Footer bar: "Discard Changes" text link (left) + "Save Changes" primary button (right) — appears when unsaved changes exist
- AI Assistant panel on far right (collapsible)

## Acceptance Criteria
- [ ] Four settings tabs are displayed in the left vertical navigation
- [ ] Active tab shows blue highlight with left border accent
- [ ] Clicking a tab switches the content area to the corresponding settings panel
- [ ] Unsaved changes trigger a confirmation dialog if the user tries to navigate away
- [ ] "Discard Changes" resets all fields to their last saved state
- [ ] "Save Changes" persists all modified settings and shows a success toast
- [ ] Footer bar with save/discard only appears when there are unsaved changes
- [ ] Tab selection is reflected in the URL for direct linking (e.g., `/settings/api-keys`)

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Use React Router nested routes for tab navigation
- Active tab styled with Tailwind `text-blue-600 border-l-2 border-blue-600 bg-blue-50`
- Implement a dirty-state tracker for form fields to control save/discard visibility
- Settings are stored using Electron's `electron-store` via IPC
- Route: `/settings/:tab` where tab = `api-keys | browser | storage | account`
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/settings/SettingsLayout.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Four settings tabs render | Unit | Verify 4 tab elements (Model API Keys, Browser Settings, Storage, Account) |
| TC-02 | Active tab shows blue highlight | Unit | Click "Model API Keys", verify `text-blue-600 border-l-2 border-blue-600` classes |
| TC-03 | Clicking tab switches content | Integration | Click "Browser Settings", verify browser settings panel renders |
| TC-04 | Unsaved changes trigger confirmation | Integration | Modify a field, try to navigate away, verify confirmation dialog |
| TC-05 | Discard resets fields | Integration | Modify field, click "Discard Changes", verify field returns to saved value |
| TC-06 | Save persists and shows toast | Integration | Modify field, click "Save Changes", verify IPC save call and success toast |
| TC-07 | Footer appears with unsaved changes | Unit | Modify a field, verify save/discard footer bar appears |
| TC-08 | URL reflects tab selection | Integration | Click "Storage" tab, verify URL contains `/settings/storage` |
