# Epic 06: Analysis Execution

## Overview
Implement the analysis progress dashboard that displays real-time workflow status, live discovery feeds, technology detection, and agent activity. This screen provides full visibility into the multi-step AI agentic analysis process.

## Figma Reference
- **Screen**: Analysis in Progress ([`1:824`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-824))
- **File**: [Site Analyser - E](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-824)

## Stories
| ID | Story | Priority |
|----|-------|----------|
| SA-601 | [Analysis Progress Dashboard](./SA-601-analysis-progress-dashboard.md) | P0 |
| SA-602 | [Workflow Step Tracker](./SA-602-workflow-step-tracker.md) | P0 |
| SA-603 | [Live Discovery Stream](./SA-603-live-discovery-stream.md) | P1 |
| SA-604 | [Detected Stack Panel](./SA-604-detected-stack-panel.md) | P1 |
| SA-605 | [Live Viewfinder](./SA-605-live-viewfinder.md) | P2 |
| SA-606 | [Agent Workflow Controls](./SA-606-agent-workflow-controls.md) | P0 |
| SA-607 | [Real-Time Statistics](./SA-607-real-time-statistics.md) | P1 |

## Acceptance Criteria (Epic-level)
- Users have full real-time visibility into every stage of the analysis
- Workflow steps update live as the backend progresses
- Users can pause or cancel the running analysis
- Live discovery stream shows pages as they're found
- Technology stack is detected and displayed in real-time

## Dependencies
- Analysis setup (Epic 05) — triggers this screen
- Backend workflow engine (Mastra agentic workflow)
- WebSocket or SSE connection for real-time updates
