# SA-1003: Authenticated Session & Cloud Sync

## User Story
**As an** authenticated user,
**I want** my session to show my identity and sync status,
**so that** I know my data is being backed up and synced to the cloud.

## Priority
P1 — High

## Figma Reference
- **Screen**: Main Dashboard ([`1:2`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-2))
- **Component**: Header — Syncing indicator ([`1:110`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-110))
- **Component**: User profile avatar ([`1:119`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-119))

## Design Specifications
- Authenticated header replaces the guest "LOCAL SESSION" badge with:
  - Cloud sync icon + "Syncing" / "Synced" / "Offline" text
  - User profile avatar (32×32 circle with real image)
- Clicking avatar opens dropdown: Display name, email, org, Switch Account, Sign Out
- Sync status updates in real-time

## Acceptance Criteria
- [ ] Authenticated users see their profile avatar from Adobe IMS
- [ ] Sync status indicator shows: "Syncing", "Synced", "Offline", or "Sync Error"
- [ ] Avatar dropdown shows: name, email, organization, "Switch Account", "Sign Out"
- [ ] "Sign Out" clears tokens and redirects to the sign-in screen
- [ ] "Switch Account" triggers a new OAuth flow
- [ ] Profile data comes from Adobe IMS token claims
- [ ] "LOCAL SESSION" badge is hidden when authenticated

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Profile data decoded from JWT claims or fetched from Adobe IMS userinfo endpoint
- Sign out: clear keychain tokens via IPC, clear in-memory Zustand state, redirect to `/sign-in`
- Sync status: poll or WebSocket from cloud backend (stub if backend not ready)
- Sync badge colors: `text-blue-600` (Syncing), `text-green-600` (Synced), `text-gray-500` (Offline)
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/auth/AuthenticatedSession.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Profile avatar renders from IMS data | Unit | Pass user with avatar URL, verify `<img>` src matches |
| TC-02 | Sync status shows Syncing/Synced/Offline | Unit | Set status to each value, verify correct text and color class |
| TC-03 | Avatar dropdown shows name/email/org | Unit | Click avatar, verify dropdown with user details |
| TC-04 | Sign Out clears tokens and redirects | Integration | Click "Sign Out", verify IPC clear and redirect to `/sign-in` |
| TC-05 | Switch Account triggers new OAuth | Integration | Click "Switch Account", verify IPC auth flow initiated |
| TC-06 | LOCAL SESSION badge hidden when authenticated | Unit | Render with authenticated user, verify "LOCAL SESSION" badge not present |
