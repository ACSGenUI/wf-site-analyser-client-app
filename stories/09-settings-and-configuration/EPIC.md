# Epic 09: Settings & Configuration

## Overview
Implement the settings screen with tabbed navigation for configuring API keys, browser behavior, storage policies, and account management. The settings screen also includes an AI assistant panel for contextual help and a settings change history.

## Figma Reference
- **Screen**: Settings & Configuration ([`1:618`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-618))
- **File**: [Site Analyser - E](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-618)

## Stories
| ID | Story | Priority |
|----|-------|----------|
| SA-901 | [Settings Navigation & Layout](./SA-901-settings-navigation-layout.md) | P0 |
| SA-902 | [Model API Keys Configuration](./SA-902-model-api-keys-config.md) | P0 |
| SA-903 | [Browser Settings](./SA-903-browser-settings.md) | P1 |
| SA-904 | [Storage & Persistence Settings](./SA-904-storage-persistence-settings.md) | P1 |
| SA-905 | [Account Settings](./SA-905-account-settings.md) | P1 |
| SA-906 | [Settings AI Assistant](./SA-906-settings-ai-assistant.md) | P2 |

## Acceptance Criteria (Epic-level)
- All settings tabs are accessible and functional
- API keys are stored securely with encryption at rest
- Settings changes require explicit save action (not auto-saved)
- Validation errors are shown inline with clear messages
- Settings are persisted locally and sync for authenticated users

## Dependencies
- Authentication system (Epic 01) — for account settings
- Electron secure storage APIs
- LLM provider APIs for key validation
