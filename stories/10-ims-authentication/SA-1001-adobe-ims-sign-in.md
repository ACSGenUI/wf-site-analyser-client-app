# SA-1001: Adobe IMS Sign-In

## User Story
**As an** enterprise user,
**I want to** sign in using my Adobe IMS credentials,
**so that** my projects, analysis history, and settings sync across devices and sessions.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Sign In / Guest Mode ([`1:1106`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1106))
- **Component**: Primary Action — "Sign in with Adobe IMS" button ([`1:1128`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1128))

## Design Specifications
- Primary CTA: Full-width button with Adobe icon + "Sign in with Adobe IMS" label
- Button uses primary blue fill with white text, rounded corners
- Loading state: spinner replaces icon, text changes to "Signing in..."
- Error state: red inline error below the button with retry action

## Acceptance Criteria
- [ ] Clicking "Sign in with Adobe IMS" opens the Adobe IMS OAuth flow in a secure browser window
- [ ] Successful authentication redirects the user to the Main Dashboard
- [ ] User's display name, avatar, and org info populate the header profile area
- [ ] Authentication tokens are stored securely in the OS keychain (macOS Keychain / Windows Credential Manager)
- [ ] Failed authentication shows an inline error message below the sign-in button
- [ ] Network errors display a descriptive error with a retry option
- [ ] Loading state shows a spinner on the button during authentication
- [ ] Token refresh is handled silently in the background

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Use Electron's `safeStorage` API for token encryption at rest
- Implement PKCE OAuth 2.0 flow for Adobe IMS
- Store refresh tokens securely in OS keychain; access tokens in memory only
- Handle token expiry with silent refresh using the stored refresh token
- IPC flow: renderer requests auth → main process opens auth window → receives callback → stores tokens → notifies renderer
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## States
| State | Behavior |
|-------|----------|
| Default | Sign-in button displayed with Adobe icon |
| Loading | Button shows spinner, text changes to "Signing in..." |
| Error | Red inline error below button with retry action |
| Success | Redirect to Main Dashboard with authenticated session |

## Test Cases

**Test File**: `src/renderer/__tests__/auth/AdobeImsSignIn.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Sign-in button renders with Adobe icon | Unit | Verify button with Adobe icon and "Sign in with Adobe IMS" text |
| TC-02 | Click opens OAuth flow via IPC | Integration | Click button, verify IPC `auth:openOAuthWindow` invoked |
| TC-03 | Successful auth redirects to Dashboard | Integration | Mock successful auth callback, verify navigation to `/dashboard` |
| TC-04 | Tokens stored in OS keychain | Integration | Complete auth, verify IPC `safeStorage:encrypt` called with tokens |
| TC-05 | Failed auth shows inline error | Unit | Mock auth failure, verify red error message below button |
| TC-06 | Network error shows retry | Unit | Mock network error, verify error message with retry button |
| TC-07 | Loading state shows spinner | Unit | Trigger auth, verify spinner on button and "Signing in..." text |
