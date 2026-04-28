# Epic 02: App Lifecycle & Updates

## Overview
Implement the auto-update system for the Site Analyzer Electron app, including version checking, blocking force-update modals with release notes, and seamless restart-and-update functionality.

## Figma Reference
- **Screen**: Force Update Required ([`1:1193`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-1193))
- **File**: [Site Analyser - E](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1193)

## Stories
| ID | Story | Priority |
|----|-------|----------|
| SA-201 | [Force Update Modal](./SA-201-force-update-modal.md) | P0 |
| SA-202 | [Version Check on Launch](./SA-202-version-check-on-launch.md) | P0 |
| SA-203 | [Release Notes Display](./SA-203-release-notes-display.md) | P1 |

## Acceptance Criteria (Epic-level)
- App checks for updates on launch and periodically during use
- When a mandatory update is available, a blocking modal prevents all interaction
- Users see clear version info, release notes, and estimated update time
- One-click "Restart and Update Now" triggers the update and restart cycle
- User's work is auto-saved before the update proceeds

## Dependencies
- Electron auto-updater (`electron-updater` or custom update server)
- Update manifest/API endpoint for version checking
- Code signing certificates for Windows and macOS
