# SA-101: Electron App Scaffolding

## User Story
**As a** developer,
**I want** a well-structured Electron + React project scaffold,
**so that** the team can begin feature development on a solid, consistent foundation.

## Priority
P0 — Critical Path (Sprint 1, Week 1)

## Design Specifications
- N/A — Engineering infrastructure story.

## Acceptance Criteria
- [ ] Electron app boots and shows a blank React renderer window on both macOS and Windows
- [ ] Project uses Electron Forge or electron-builder for build tooling
- [ ] Renderer process uses React 19 with TypeScript strict mode
- [ ] Main process is written in TypeScript with proper IPC type safety
- [ ] Hot module replacement (HMR) works in development mode
- [ ] Source maps are enabled in development, stripped in production
- [ ] `preload.ts` script exposes a typed `contextBridge` API for renderer ↔ main IPC
- [ ] Environment-specific config (dev/staging/prod) is supported via `.env` files
- [ ] Project README includes setup instructions, scripts reference, and architecture overview

## Technical Notes
- Recommended stack: Electron 30+, React 19, TypeScript 5+, Vite (via electron-vite or custom)
- Use `contextBridge` + `ipcRenderer.invoke` pattern — never expose `ipcRenderer` directly
- Folder structure:

```
src/
├── main/           # Electron main process
│   ├── index.ts
│   ├── ipc/        # IPC handlers
│   └── services/   # Native services (storage, updater, etc.)
├── preload/        # Preload scripts
│   └── index.ts
├── renderer/       # React app
│   ├── App.tsx
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── store/
│   ├── styles/
│   └── utils/
└── shared/         # Types/constants shared between processes
    └── types.ts
```

- Configure path aliases (`@/components`, `@/hooks`, etc.) in `tsconfig.json` and bundler
- Set `nodeIntegration: false` and `contextIsolation: true` in `BrowserWindow` options
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Definition of Done
- [ ] `npm run dev` launches the app with HMR in < 5 seconds
- [ ] `npm run build` produces a runnable executable
- [ ] TypeScript compilation has zero errors in strict mode
- [ ] IPC round-trip test passes (renderer calls main, gets typed response)

## Test Cases

**Test File**: `src/renderer/__tests__/setup/electron-scaffolding.test.ts`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | App boots successfully | E2E | Electron app launches and renders the React root window on the target platform |
| TC-02 | IPC round-trip communication | Integration | Renderer invokes a main-process handler via IPC and receives a typed response |
| TC-03 | HMR works in development | E2E | Modifying a renderer source file triggers a hot-reload without full page refresh |
| TC-04 | Preload contextBridge exposes typed API | Unit | `window.api` object contains all expected typed methods after preload executes |
| TC-05 | Environment config loads correctly | Unit | `.env` variables for dev/staging/prod are resolved and accessible at runtime |
