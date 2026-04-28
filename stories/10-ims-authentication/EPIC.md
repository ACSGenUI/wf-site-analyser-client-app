# Epic 10: IMS Authentication (Final Sprint)

## Overview
Integrate Adobe IMS enterprise SSO authentication into the app. This is the final epic, added after all core functionality has been proven in guest mode. It introduces the sign-in screen, cloud sync, authenticated session management, and guest-to-authenticated data migration.

## Figma Reference
- **Screen**: Sign In / Guest Mode ([`1:1106`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1106))
- **File**: [Site Analyser - E](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1106)

## Stories
| ID | Story | Priority |
|----|-------|----------|
| SA-1001 | [Adobe IMS Sign-In](./SA-1001-adobe-ims-sign-in.md) | P0 |
| SA-1002 | [Sign-In Screen UI](./SA-1002-sign-in-screen-ui.md) | P0 |
| SA-1003 | [Authenticated Session & Cloud Sync](./SA-1003-authenticated-session-and-cloud-sync.md) | P1 |
| SA-1004 | [Guest-to-Authenticated Migration](./SA-1004-guest-to-authenticated-migration.md) | P1 |

## Acceptance Criteria (Epic-level)
- Users can sign in with Adobe IMS SSO via PKCE OAuth 2.0
- Users can continue using the app as a guest (opt-in authentication)
- Authenticated users see profile info, cloud sync, and org details
- Guest users who later sign in can merge their local data to the cloud account
- Sign-in screen matches the Figma design with branding and decorative elements
- Token management is secure (OS keychain, encrypted at rest)

## Dependencies
- Anonymous session handling (Epic 03) — guest mode must work first
- All core features (Epics 04–09) — app must be functional before adding auth gate
- Adobe IMS SDK / OAuth configuration
- Cloud sync backend API (if applicable)
