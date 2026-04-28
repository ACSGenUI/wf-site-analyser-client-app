# SA-805: RAG Knowledge Base Generation

## User Story
**As a** system,
**I want** analysis results automatically converted into a searchable knowledge base,
**so that** the AI assistant can provide accurate, context-aware answers about the analyzed site.

## Priority
P0 — Critical Path

## Figma Reference
- **Screen**: Results Workspace ([`1:158`](https://www.figma.com/design/IXdcbiwXTZv2hsY18hSYGZ/Site-Analyser---E?node-id=1-158))
- **Component**: "● RAG ACTIVE" status indicator in chat panel footer

## Design Specifications
- "● RAG ACTIVE" green indicator in the chat panel footer confirms knowledge base is ready
- When building: "● INDEXING..." amber indicator with progress
- When failed: "● RAG UNAVAILABLE" red indicator with retry option

## Acceptance Criteria
- [ ] After analysis completes, results are automatically processed into a RAG-compatible knowledge base
- [ ] Indexing includes: page templates, UI blocks, screenshots (with descriptions), metrics, detected stack, and raw HTML snippets
- [ ] "RAG ACTIVE" indicator appears in the chat panel once indexing is complete
- [ ] Indexing progress is shown during the build phase ("Indexing... 45%")
- [ ] If indexing fails, a clear error is shown with a manual retry option
- [ ] The knowledge base is queryable immediately after the indicator turns green
- [ ] Knowledge base is cached locally to avoid re-indexing on subsequent visits to the same analysis

## Technical Notes
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Indexing pipeline: analysis output → text chunking → embedding generation → vector store insertion
- Use a local vector store (e.g., Chroma, LanceDB, or in-memory FAISS) for desktop performance
- Embedding model: can use local model or API-based (configurable in Settings)
- Chunks should include metadata: source type (template, block, screenshot), IDs, and confidence scores
- RAG retrieval: top-K relevant chunks → LLM prompt augmentation → streaming response
- Cache the vector store to disk so it persists between sessions for the same analysis
- Indicator colors: green `bg-green-500` (active), amber `bg-amber-500` (indexing), red `bg-red-500` (error)
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Test Cases

**Test File**: `src/renderer/__tests__/features/chat/RagKnowledgeBase.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Indexing starts after analysis completes | Integration | Complete analysis, verify indexing pipeline triggered |
| TC-02 | RAG ACTIVE indicator green when ready | Unit | Set status to "active", verify green dot with `bg-green-500` class |
| TC-03 | INDEXING amber indicator during build | Unit | Set status to "indexing", verify amber dot with `bg-amber-500` class |
| TC-04 | Error state shows retry option | Unit | Set status to "error", verify red indicator and retry button |
| TC-05 | Knowledge base cached locally | Integration | Complete indexing, reload, verify cache hit (no re-index) |
| TC-06 | Queryable after green indicator | Integration | Set status to "active", send query, verify response received |
