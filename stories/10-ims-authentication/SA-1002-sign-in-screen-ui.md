# SA-1002: Sign-In Screen UI

## User Story
**As a** user,
**I want** a polished sign-in screen with branding and clear options,
**so that** I can choose between enterprise sign-in and guest mode.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Sign In / Guest Mode ([`1:1106`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1106))
- **Component**: Full sign-in screen layout

## Design Specifications
- Full-screen layout with NO sidebar or header (standalone transactional screen)
- Centered sign-in card (448px wide) with:
  - Branding header: App icon (blue rounded square), "Site Analyzer" title, tagline
  - "Sign In" heading + "Access your analysis workspace" subtitle
  - "Sign in with Adobe IMS" primary button (SA-1001)
  - Divider with "or" text
  - "Continue as Guest" secondary outlined button
  - Guest mode info panel: info icon + "Guest Mode Information" + explanation text
  - Footer links: Terms of Service, Privacy Policy, System Status
- Right decorative panel: "The Precision Architect" tagline, stats (99.9% Uptime SLA, 0.2s Avg Latency), dashboard preview thumbnail
- Subtle decorative background blur/gradient elements
- Bottom metadata: environment info + connection status indicator

## Acceptance Criteria
- [ ] Sign-in screen is shown on app launch when no valid session exists
- [ ] "Sign in with Adobe IMS" triggers the OAuth flow (SA-1001)
- [ ] "Continue as Guest" bypasses auth and goes to Dashboard in guest mode
- [ ] Guest mode info panel explains limitations (local only, no sync)
- [ ] Right decorative panel renders with branding content
- [ ] Screen is responsive across common desktop resolutions
- [ ] Footer links open in external browser
- [ ] If a valid session already exists (from previous sign-in), skip this screen

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Route: `/sign-in` — rendered WITHOUT the app shell (no sidebar/header)
- Sign-in card centered with Tailwind `max-w-md mx-auto` (448px width)
- Check for valid session on app launch: if token exists and is not expired, skip to Dashboard
- "Continue as Guest" is the same flow as current behavior (Epic 03), just now reachable from this screen
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/auth/SignInScreen.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Screen renders without app shell | Unit | Verify no sidebar or header elements present |
| TC-02 | Centered card at 448px width | Unit | Verify card has `max-w-md` Tailwind class |
| TC-03 | Adobe IMS button triggers SA-1001 flow | Integration | Click "Sign in with Adobe IMS", verify OAuth flow initiated |
| TC-04 | Continue as Guest navigates to Dashboard | Integration | Click "Continue as Guest", verify navigation to `/dashboard` |
| TC-05 | Guest info panel explains limitations | Unit | Verify info panel text about local-only mode and no sync |
| TC-06 | Right decorative panel renders | Unit | Verify decorative panel with tagline and stats |
| TC-07 | Footer links open external browser | Integration | Click "Terms of Service", verify external browser open via IPC |
| TC-08 | Valid session skips this screen | Integration | Mock valid token, render app, verify redirect past sign-in |
