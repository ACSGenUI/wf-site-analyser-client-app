# Epic 04: Dashboard & Navigation

## Overview
Implement the main dashboard and global navigation system for the Site Analyzer app. The dashboard serves as the primary landing screen, providing quick access to new analyses, data source selection, and an overview of capabilities. The navigation system provides consistent wayfinding across all screens.

## Figma Reference
- **Screen**: Main Dashboard — Empty State ([`1:2`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-2))
- **File**: [Site Analyser - E](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=0-1)

## Stories
| ID | Story | Priority |
|----|-------|----------|
| SA-401 | [Left Navigation Rail](./SA-401-left-navigation-rail.md) | P0 |
| SA-402 | [Top Header Bar](./SA-402-top-header-bar.md) | P0 |
| SA-403 | [Dashboard Empty State](./SA-403-dashboard-empty-state.md) | P0 |
| SA-404 | [Onboarding Info Cards](./SA-404-onboarding-info-cards.md) | P1 |
| SA-405 | [Data Source Selection Cards](./SA-405-data-source-selection-cards.md) | P0 |
| SA-406 | [New Analysis FAB](./SA-406-new-analysis-fab.md) | P1 |

## Acceptance Criteria (Epic-level)
- Dashboard loads as the default screen after authentication
- Navigation rail provides access to all major sections
- Empty state guides users toward their first analysis
- Data source cards provide clear entry points for each input method
- Layout is responsive across common desktop resolutions (1280px–2560px)

## Dependencies
- Authentication system (Epic 01)
- Routing / navigation framework (React Router or equivalent)
