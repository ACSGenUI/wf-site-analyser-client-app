# SA-905: Account Settings

## User Story
**As an** authenticated user,
**I want to** manage my account information and session,
**so that** I can view my profile, switch accounts, or sign out.

## Priority
P1 — High

## Figma Reference
- **Screen**: Settings & Configuration ([`1:618`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-618))
- **Component**: Account tab in settings navigation

## Design Specifications
- Tab heading: "Account" + description "Manage your Adobe IMS account and session."
- Sections:
  - **Profile Information**: Display name, email, organization (read-only from Adobe IMS)
  - **Session Management**: Current session info, "Sign Out" button, "Switch Account" option
  - **Data Sync**: Toggle for cloud sync, last sync timestamp
  - **Guest Mode Info**: If in guest mode, show an "Upgrade to Adobe IMS" CTA

## Acceptance Criteria
- [ ] Authenticated users see their profile info from Adobe IMS (name, email, org)
- [ ] "Sign Out" button clears the session and returns to the sign-in screen
- [ ] "Switch Account" triggers a new Adobe IMS authentication flow
- [ ] Cloud sync toggle enables/disables sync for the current session
- [ ] Guest users see limited account info with a prompt to sign in
- [ ] Last sync timestamp is displayed when cloud sync is enabled
- [ ] All account actions require confirmation dialogs

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Profile data comes from the Adobe IMS token claims
- Sign out should clear: tokens from keychain, in-memory state, and redirect to sign-in
- Switch account: clear current tokens via IPC, then initiate a new OAuth flow
- Guest mode: show "Sign in with Adobe IMS" CTA with Tailwind `bg-blue-600 text-white` styling
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/settings/AccountSettings.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Guest mode shows limited info | Unit | Render in guest mode, verify sign-in CTA and limited account info |
| TC-02 | Sign Out clears session and redirects | Integration | Click "Sign Out", verify IPC clear tokens called and redirect to `/sign-in` |
| TC-03 | Profile info displays for authenticated | Unit | Render with auth user, verify name, email, and org displayed |
| TC-04 | Switch Account triggers new OAuth | Integration | Click "Switch Account", verify IPC auth flow initiated |
| TC-05 | Cloud sync toggle works | Unit | Toggle cloud sync, verify visual state changes |
| TC-06 | Confirmation dialog on Sign Out | Unit | Click "Sign Out", verify confirmation dialog renders before action |
