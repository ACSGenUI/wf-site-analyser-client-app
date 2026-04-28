# Epic 07: Results Workspace

## Overview
Implement the results workspace that displays the structured output of a completed analysis. This includes page summaries, performance metrics, downloadable artifacts, screenshot galleries, and extracted UI block tables. The workspace uses a split layout with the RAG chat panel on the right.

## Figma Reference
- **Screen**: Results Workspace & RAG Chat ([`1:158`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158))
- **File**: [Site Analyser - E](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158)

## Stories
| ID | Story | Priority |
|----|-------|----------|
| SA-701 | [Results Split Layout](./SA-701-results-split-layout.md) | P0 |
| SA-702 | [Page Summary Card](./SA-702-page-summary-card.md) | P0 |
| SA-703 | [Artifacts Download Panel](./SA-703-artifacts-download-panel.md) | P1 |
| SA-704 | [Screenshot Gallery](./SA-704-screenshot-gallery.md) | P1 |
| SA-705 | [Extracted UI Blocks Table](./SA-705-extracted-ui-blocks-table.md) | P0 |
| SA-706 | [Confidence & Status Indicators](./SA-706-confidence-status-indicators.md) | P1 |

## Acceptance Criteria (Epic-level)
- Results are displayed immediately after analysis completion
- All generated data is structured and browsable
- Artifacts are downloadable with one click
- Screenshots are viewable in a gallery
- UI blocks are listed in a sortable, filterable table
- Confidence scores provide transparency on analysis quality

## Dependencies
- Analysis execution (Epic 06) — provides the output data
- RAG chat system (Epic 08) — right panel
- File system access for artifact downloads
