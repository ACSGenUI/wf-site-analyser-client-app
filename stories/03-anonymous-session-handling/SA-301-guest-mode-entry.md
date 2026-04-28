# SA-301: Guest Mode Entry

## User Story
**As a** user launching the app,
**I want to** start using the app immediately without signing in,
**so that** I can evaluate the tool and run analyses without friction.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Sign In / Guest Mode ([`1:1106`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1106))
- **Component**: "Continue as Guest" button ([`1:1140`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1140))
- **Component**: Guest mode information panel ([`1:1142`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1142))

## Design Specifications
- Until IMS auth is implemented (Epic 10), the app boots directly to the Dashboard in guest mode
- A "LOCAL SESSION" green badge appears in the header ([`1:103`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-103))
- No sign-in gate or authentication prompt is shown in this phase
- Guest mode info is available in Settings > Account explaining local-only limitations

## Acceptance Criteria
- [ ] App launches directly to the Dashboard without any sign-in screen
- [ ] A local anonymous user ID (UUID) is generated on first launch and persisted
- [ ] "LOCAL SESSION" badge is displayed in the header throughout the session
- [ ] Guest users can access all features: analysis setup, execution, results, RAG chat, settings
- [ ] No network calls are required for session initialization (works fully offline)
- [ ] The anonymous user ID persists across app restarts
- [ ] When IMS auth is added later (Epic 10), guest data can be migrated to an authenticated account

## Technical Notes
- Generate UUID on first launch, store in `electron-store`
- All data is keyed to this anonymous user ID for future migration support
- Session state in global store: `{ mode: 'guest', userId: string, createdAt: Date }`
- Header component reads session state and renders the appropriate badge
- No auth guard on any route in this phase — all routes are accessible
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## States
| State | Behavior |
|-------|----------|
| First Launch | UUID generated, app opens to Dashboard, "LOCAL SESSION" badge shown |
| Subsequent Launch | Existing UUID loaded, previous data available |
| Offline | Fully functional, no degradation |

## Test Cases

**Test File**: `src/renderer/__tests__/auth/GuestModeEntry.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | App launches to Dashboard without sign-in | Integration | Verifies the app renders the Dashboard directly with no sign-in gate |
| TC-02 | UUID generated on first launch | Unit | Confirms a valid UUID is created and stored in `electron-store` on initial boot |
| TC-03 | UUID persists across restarts | Integration | Mocks an app restart and verifies the same UUID is reloaded from storage |
| TC-04 | LOCAL SESSION badge shown in header | Unit | Renders the header component and asserts the "LOCAL SESSION" badge is visible |
| TC-05 | All features accessible in guest mode | Integration | Navigates to analysis, results, RAG chat, and settings routes without auth blocking |
| TC-06 | Works fully offline | Unit | Ensures session initialization completes without any network calls |
