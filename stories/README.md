# Site Analyzer — Product Stories

Structured user stories for the **Site Analyzer** Electron desktop application, an AI-powered agentic website analysis tool for enterprise users.

**Figma Source**: [Site Analyser - E](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=0-1)

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | **React 19** | Functional components with TypeScript strict mode |
| Styling | **Tailwind CSS** | Utility-first with custom design tokens in `tailwind.config.ts` |
| State | **Zustand** | Global state; **React Hook Form** + **Zod** for forms |
| Routing | **React Router v6+** | `createHashRouter` for Electron compatibility |
| UI Primitives | **Radix UI** | Headless primitives styled with Tailwind CSS |
| Testing | **Vitest** + **React Testing Library** | Unit, Integration, and E2E (Playwright) |
| Desktop | **Electron** | IPC via `contextBridge`, `electron-store`, `safeStorage` |
| Code Quality | **ESLint**, **Prettier**, **Husky**, **lint-staged**, **Commitlint** | Enforced via pre-commit hooks |

> Each story includes a **Test Cases** section with mapped test file paths following the convention `src/renderer/__tests__/{area}/{ComponentName}.test.tsx`.

---

## Epic Overview

| # | Epic | Stories | Priority | Sprint | Figma Screen |
|---|------|---------|----------|--------|--------------|
| 01 | [Project Setup & Best Practices](./01-project-setup-and-best-practices/EPIC.md) | 7 | P0 | Sprint 1 | N/A (Engineering) |
| 02 | [App Lifecycle & Updates](./02-app-lifecycle-and-updates/EPIC.md) | 3 | P0 | Sprint 1–2 | Force Update Required |
| 03 | [Anonymous Session Handling](./03-anonymous-session-handling/EPIC.md) | 3 | P0 | Sprint 2 | Sign In (Guest flow) |
| 04 | [Dashboard & Navigation](./04-dashboard-and-navigation/EPIC.md) | 6 | P0 | Sprint 2 | Main Dashboard — Empty State |
| 05 | [Analysis Setup & Input](./05-analysis-setup-and-input/EPIC.md) | 8 | P0 | Sprint 3 | New Analysis Setup |
| 06 | [Analysis Execution](./06-analysis-execution/EPIC.md) | 7 | P0 | Sprint 3–4 | Analysis in Progress |
| 07 | [Results Workspace](./07-results-workspace/EPIC.md) | 6 | P0 | Sprint 4 | Results Workspace & RAG Chat |
| 08 | [RAG Chat](./08-rag-chat/EPIC.md) | 5 | P0 | Sprint 4–5 | Results Workspace — Right Panel |
| 09 | [Settings & Configuration](./09-settings-and-configuration/EPIC.md) | 6 | P0 | Sprint 5 | Settings & Configuration |
| 10 | [IMS Authentication](./10-ims-authentication/EPIC.md) | 4 | P0 | Sprint 6 (Final) | Sign In / Guest Mode |

**Total: 10 Epics, 55 Stories**

---

## Full Story Index

### Epic 01: Project Setup & Best Practices
| ID | Story | Priority |
|----|-------|----------|
| SA-101 | [Electron App Scaffolding](./01-project-setup-and-best-practices/SA-101-electron-app-scaffolding.md) | P0 |
| SA-102 | [Design System & Component Library](./01-project-setup-and-best-practices/SA-102-design-system-and-component-library.md) | P0 |
| SA-103 | [Routing & Navigation Architecture](./01-project-setup-and-best-practices/SA-103-routing-and-navigation-architecture.md) | P0 |
| SA-104 | [State Management & Data Layer](./01-project-setup-and-best-practices/SA-104-state-management-and-data-layer.md) | P0 |
| SA-105 | [Build, Packaging & Distribution](./01-project-setup-and-best-practices/SA-105-build-packaging-and-distribution.md) | P0 |
| SA-106 | [Code Quality & Linting Standards](./01-project-setup-and-best-practices/SA-106-code-quality-and-linting-standards.md) | P0 |
| SA-107 | [Testing Framework & Strategy](./01-project-setup-and-best-practices/SA-107-testing-framework-and-strategy.md) | P1 |

### Epic 02: App Lifecycle & Updates
| ID | Story | Priority |
|----|-------|----------|
| SA-201 | [Force Update Modal](./02-app-lifecycle-and-updates/SA-201-force-update-modal.md) | P0 |
| SA-202 | [Version Check on Launch](./02-app-lifecycle-and-updates/SA-202-version-check-on-launch.md) | P0 |
| SA-203 | [Release Notes Display](./02-app-lifecycle-and-updates/SA-203-release-notes-display.md) | P1 |

### Epic 03: Anonymous Session Handling
| ID | Story | Priority |
|----|-------|----------|
| SA-301 | [Guest Mode Entry](./03-anonymous-session-handling/SA-301-guest-mode-entry.md) | P0 |
| SA-302 | [Session State Display](./03-anonymous-session-handling/SA-302-session-state-display.md) | P0 |
| SA-303 | [Local Data Persistence](./03-anonymous-session-handling/SA-303-local-data-persistence.md) | P0 |

### Epic 04: Dashboard & Navigation
| ID | Story | Priority |
|----|-------|----------|
| SA-401 | [Left Navigation Rail](./04-dashboard-and-navigation/SA-401-left-navigation-rail.md) | P0 |
| SA-402 | [Top Header Bar](./04-dashboard-and-navigation/SA-402-top-header-bar.md) | P0 |
| SA-403 | [Dashboard Empty State](./04-dashboard-and-navigation/SA-403-dashboard-empty-state.md) | P0 |
| SA-404 | [Onboarding Info Cards](./04-dashboard-and-navigation/SA-404-onboarding-info-cards.md) | P1 |
| SA-405 | [Data Source Selection Cards](./04-dashboard-and-navigation/SA-405-data-source-selection-cards.md) | P0 |
| SA-406 | [New Analysis FAB](./04-dashboard-and-navigation/SA-406-new-analysis-fab.md) | P1 |

### Epic 05: Analysis Setup & Input
| ID | Story | Priority |
|----|-------|----------|
| SA-501 | [New Analysis Setup Screen](./05-analysis-setup-and-input/SA-501-new-analysis-setup-screen.md) | P0 |
| SA-502 | [Single URL Input Tab](./05-analysis-setup-and-input/SA-502-single-url-input-tab.md) | P0 |
| SA-503 | [URL List Batch Input Tab](./05-analysis-setup-and-input/SA-503-url-list-batch-input-tab.md) | P1 |
| SA-504 | [CSV Upload Tab](./05-analysis-setup-and-input/SA-504-csv-upload-tab.md) | P1 |
| SA-505 | [Figma Input Tab](./05-analysis-setup-and-input/SA-505-figma-input-tab.md) | P2 |
| SA-506 | [Crawl Configuration Options](./05-analysis-setup-and-input/SA-506-crawl-configuration-options.md) | P0 |
| SA-507 | [Resource Estimate Panel](./05-analysis-setup-and-input/SA-507-resource-estimate-panel.md) | P1 |
| SA-508 | [AI Assistant Setup Guide](./05-analysis-setup-and-input/SA-508-ai-assistant-setup-guide.md) | P2 |

### Epic 06: Analysis Execution
| ID | Story | Priority |
|----|-------|----------|
| SA-601 | [Analysis Progress Dashboard](./06-analysis-execution/SA-601-analysis-progress-dashboard.md) | P0 |
| SA-602 | [Workflow Step Tracker](./06-analysis-execution/SA-602-workflow-step-tracker.md) | P0 |
| SA-603 | [Live Discovery Stream](./06-analysis-execution/SA-603-live-discovery-stream.md) | P1 |
| SA-604 | [Detected Stack Panel](./06-analysis-execution/SA-604-detected-stack-panel.md) | P1 |
| SA-605 | [Live Viewfinder](./06-analysis-execution/SA-605-live-viewfinder.md) | P2 |
| SA-606 | [Agent Workflow Controls](./06-analysis-execution/SA-606-agent-workflow-controls.md) | P0 |
| SA-607 | [Real-Time Statistics](./06-analysis-execution/SA-607-real-time-statistics.md) | P1 |

### Epic 07: Results Workspace
| ID | Story | Priority |
|----|-------|----------|
| SA-701 | [Results Split Layout](./07-results-workspace/SA-701-results-split-layout.md) | P0 |
| SA-702 | [Page Summary Card](./07-results-workspace/SA-702-page-summary-card.md) | P0 |
| SA-703 | [Artifacts Download Panel](./07-results-workspace/SA-703-artifacts-download-panel.md) | P1 |
| SA-704 | [Screenshot Gallery](./07-results-workspace/SA-704-screenshot-gallery.md) | P1 |
| SA-705 | [Extracted UI Blocks Table](./07-results-workspace/SA-705-extracted-ui-blocks-table.md) | P0 |
| SA-706 | [Confidence & Status Indicators](./07-results-workspace/SA-706-confidence-status-indicators.md) | P1 |

### Epic 08: RAG Chat
| ID | Story | Priority |
|----|-------|----------|
| SA-801 | [Chat Panel Interface](./08-rag-chat/SA-801-chat-panel-interface.md) | P0 |
| SA-802 | [Source Citations & References](./08-rag-chat/SA-802-source-citations-references.md) | P0 |
| SA-803 | [Conversation History](./08-rag-chat/SA-803-conversation-history.md) | P1 |
| SA-804 | [Suggested Prompt Chips](./08-rag-chat/SA-804-suggested-prompt-chips.md) | P1 |
| SA-805 | [RAG Knowledge Base Generation](./08-rag-chat/SA-805-rag-knowledge-base-generation.md) | P0 |

### Epic 09: Settings & Configuration
| ID | Story | Priority |
|----|-------|----------|
| SA-901 | [Settings Navigation & Layout](./09-settings-and-configuration/SA-901-settings-navigation-layout.md) | P0 |
| SA-902 | [Model API Keys Configuration](./09-settings-and-configuration/SA-902-model-api-keys-config.md) | P0 |
| SA-903 | [Browser Settings](./09-settings-and-configuration/SA-903-browser-settings.md) | P1 |
| SA-904 | [Storage & Persistence Settings](./09-settings-and-configuration/SA-904-storage-persistence-settings.md) | P1 |
| SA-905 | [Account Settings](./09-settings-and-configuration/SA-905-account-settings.md) | P1 |
| SA-906 | [Settings AI Assistant](./09-settings-and-configuration/SA-906-settings-ai-assistant.md) | P2 |

### Epic 10: IMS Authentication (Final Sprint)
| ID | Story | Priority |
|----|-------|----------|
| SA-1001 | [Adobe IMS Sign-In](./10-ims-authentication/SA-1001-adobe-ims-sign-in.md) | P0 |
| SA-1002 | [Sign-In Screen UI](./10-ims-authentication/SA-1002-sign-in-screen-ui.md) | P0 |
| SA-1003 | [Authenticated Session & Cloud Sync](./10-ims-authentication/SA-1003-authenticated-session-and-cloud-sync.md) | P1 |
| SA-1004 | [Guest-to-Authenticated Migration](./10-ims-authentication/SA-1004-guest-to-authenticated-migration.md) | P1 |

---

## Priority Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 33 | Critical path — must have for MVP |
| P1 | 17 | High priority — important for production readiness |
| P2 | 5 | Medium — enhances experience, can follow initial release |

---

## Sprint Roadmap

| Sprint | Epics | Focus |
|--------|-------|-------|
| Sprint 1 | Epic 01, 02 | Foundation: scaffolding, design system, routing, state, build, quality, update flow |
| Sprint 2 | Epic 03, 04 | App shell: anonymous session, dashboard, navigation, empty states |
| Sprint 3 | Epic 05, 06 (start) | Core flow: analysis setup, input methods, execution begins |
| Sprint 4 | Epic 06 (finish), 07 | Output: execution complete, results workspace, artifacts |
| Sprint 5 | Epic 08, 09 | Intelligence: RAG chat, settings & configuration |
| Sprint 6 | Epic 10 | Enterprise: Adobe IMS SSO, sign-in screen, cloud sync, data migration |

---

## Screen-to-Epic Mapping

| Figma Screen | Node ID | Epic(s) |
|--------------|---------|---------|
| N/A (Engineering Setup) | — | Epic 01 |
| Force Update Required | `1:1193` | Epic 02 |
| Sign In / Guest Mode (Guest flow) | `1:1106` | Epic 03 |
| Main Dashboard — Empty State | `1:2` | Epic 04 |
| New Analysis Setup | `1:419` | Epic 05 |
| Analysis in Progress | `1:824` | Epic 06 |
| Results Workspace & RAG Chat | `1:158` | Epic 07, Epic 08 |
| Settings & Configuration | `1:618` | Epic 09 |
| Sign In / Guest Mode (IMS flow) | `1:1106` | Epic 10 |
