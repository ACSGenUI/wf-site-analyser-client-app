# Epic 03: Anonymous Session Handling

## Overview
Enable the app to function fully in anonymous/guest mode without requiring authentication. This includes local session management, data persistence across app restarts, and clear visual indicators of session state. Guest mode is the default experience until IMS authentication is added in the final sprint (Epic 10).

## Figma Reference
- **Screen**: Sign In / Guest Mode ([`1:1106`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1106)) — "Continue as Guest" flow
- **Screen**: Main Dashboard ([`1:2`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-2)) — "LOCAL SESSION" badge in header
- **Screen**: Settings & Configuration ([`1:618`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-618)) — Storage/persistence settings
- **File**: [Site Analyser - E](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=0-1)

## Stories
| ID | Story | Priority |
|----|-------|----------|
| SA-301 | [Guest Mode Entry](./SA-301-guest-mode-entry.md) | P0 |
| SA-302 | [Session State Display](./SA-302-session-state-display.md) | P0 |
| SA-303 | [Local Data Persistence](./SA-303-local-data-persistence.md) | P0 |

## Acceptance Criteria (Epic-level)
- App launches directly into guest mode (no sign-in gate until Epic 10)
- "LOCAL SESSION" badge is visible in the header at all times
- All analysis workflows function fully without authentication
- User data (projects, history, outputs, chat) persists locally between sessions
- Data survives app restarts and OS reboots
- Storage retention is configurable in Settings

## Dependencies
- Project scaffolding and state management (Epic 01)
- Electron secure storage APIs (`electron-store`, `better-sqlite3`)
