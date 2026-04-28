# SA-104: State Management & Data Layer

## User Story
**As a** developer,
**I want** a consistent state management and data persistence layer,
**so that** app state, form data, and analysis outputs are managed predictably across components and sessions.

## Priority
P0 — Critical Path (Sprint 1)

## Acceptance Criteria
- [ ] Global state manager is set up for cross-cutting concerns: session, active project, sync status, theme
- [ ] Local/component state conventions are documented (when to use global vs local vs form state)
- [ ] Data persistence layer abstracts Electron's file system and SQLite for local storage
- [ ] IPC service layer provides typed methods for renderer → main process communication
- [ ] Real-time data layer is stubbed for WebSocket/SSE events (used by Epic 05 progress tracking)
- [ ] Form state management library is integrated for analysis setup forms (Epic 04)
- [ ] State hydration on app startup: load persisted state from disk into memory

## Technical Notes
- **Global state**: Zustand (lightweight, no boilerplate) or Redux Toolkit (if team prefers)
- **Form state**: React Hook Form with Zod schema validation
- **Persistence**: `electron-store` for simple key-value, SQLite (via `better-sqlite3`) for structured data
- **IPC layer**: Create a typed `api` object exposed via `contextBridge`:

```typescript
// preload.ts
contextBridge.exposeInMainWorld('api', {
  storage: {
    get: (key: string) => ipcRenderer.invoke('storage:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('storage:set', key, value),
  },
  analysis: {
    start: (config: AnalysisConfig) => ipcRenderer.invoke('analysis:start', config),
    onProgress: (cb: (data: ProgressEvent) => void) => ipcRenderer.on('analysis:progress', (_, data) => cb(data)),
  },
  // ...
});
```

- **Real-time events**: Use Electron IPC to proxy WebSocket/SSE events from main process to renderer
- Define all shared types in `src/shared/types.ts`
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Definition of Done
- [ ] A Zustand/Redux store is initialized and accessible from any component
- [ ] `electron-store` read/write works via IPC from the renderer
- [ ] React Hook Form + Zod validation demo works on a test form
- [ ] IPC type safety: calling a non-existent handler shows a TypeScript error

## Test Cases

**Test File**: `src/renderer/__tests__/setup/state-management.test.ts`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Zustand store initializes | Unit | Global Zustand store creates with default state and is accessible from components |
| TC-02 | electron-store read/write via IPC | Integration | Renderer reads and writes key-value data to electron-store through IPC bridge |
| TC-03 | React Hook Form + Zod validation | Unit | Form with Zod schema validates input and surfaces errors on invalid submission |
| TC-04 | State hydration on startup | Integration | Persisted state is loaded from disk into the Zustand store when the app initializes |
| TC-05 | IPC service layer type safety | Unit | Calling a non-existent IPC handler produces a TypeScript compilation error |
