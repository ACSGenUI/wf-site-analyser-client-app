# Epic 05: Analysis Setup & Input

## Overview
Implement the analysis configuration screen where users select their input method, configure crawl parameters, and launch the AI-powered analysis workflow. Supports multiple input types via a tabbed interface with real-time resource estimation and an AI assistant for guidance.

## Figma Reference
- **Screen**: New Analysis Setup ([`1:419`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-419))
- **File**: [Site Analyser - E](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-419)

## Stories
| ID | Story | Priority |
|----|-------|----------|
| SA-501 | [New Analysis Setup Screen](./SA-501-new-analysis-setup-screen.md) | P0 |
| SA-502 | [Single URL Input Tab](./SA-502-single-url-input-tab.md) | P0 |
| SA-503 | [URL List Batch Input Tab](./SA-503-url-list-batch-input-tab.md) | P1 |
| SA-504 | [CSV Upload Tab](./SA-504-csv-upload-tab.md) | P1 |
| SA-505 | [Figma Input Tab](./SA-505-figma-input-tab.md) | P2 |
| SA-506 | [Crawl Configuration Options](./SA-506-crawl-configuration-options.md) | P0 |
| SA-507 | [Resource Estimate Panel](./SA-507-resource-estimate-panel.md) | P1 |
| SA-508 | [AI Assistant Setup Guide](./SA-508-ai-assistant-setup-guide.md) | P2 |

## Acceptance Criteria (Epic-level)
- Users can switch between four input tabs seamlessly
- Form validation prevents submission with invalid inputs
- Resource estimate updates dynamically as inputs change
- "Begin Analysis" triggers the workflow and navigates to the progress screen
- AI Assistant is available for contextual guidance during setup

## Dependencies
- Navigation system (Epic 04)
- Workflow execution engine (Epic 06)
- RAG chat system (Epic 08)
