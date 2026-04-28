# Epic 08: RAG Chat

## Overview
Implement the RAG-powered chat interface that allows users to query the analysis results using natural language. The chat references the generated knowledge base (templates, blocks, screenshots, metrics) and provides contextual answers with source citations.

## Figma Reference
- **Screen**: Results Workspace & RAG Chat — right panel ([`1:158`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158))
- **File**: [Site Analyser - E](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158)

## Stories
| ID | Story | Priority |
|----|-------|----------|
| SA-801 | [Chat Panel Interface](./SA-801-chat-panel-interface.md) | P0 |
| SA-802 | [Source Citations & References](./SA-802-source-citations-references.md) | P0 |
| SA-803 | [Conversation History](./SA-803-conversation-history.md) | P1 |
| SA-804 | [Suggested Prompt Chips](./SA-804-suggested-prompt-chips.md) | P1 |
| SA-805 | [RAG Knowledge Base Generation](./SA-805-rag-knowledge-base-generation.md) | P0 |

## Acceptance Criteria (Epic-level)
- Analysis results are automatically indexed into a RAG knowledge base
- Users can ask natural language questions about the analyzed site
- Responses include source citations referencing specific templates, blocks, and screenshots
- Conversation history is preserved within the session
- Suggested prompts guide users toward useful queries

## Dependencies
- Analysis execution (Epic 06) — provides the data to index
- Results workspace (Epic 07) — hosts the chat panel
- LLM API access (configured in Settings, Epic 09)
- Vector store / embedding infrastructure
