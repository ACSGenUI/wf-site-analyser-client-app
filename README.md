# WF Site Analyser – Client App

Desktop application for analysing web-site UI competency, built with **Electron + React 19 + TypeScript**.

## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10

## Quick Start

```bash
# Install dependencies
npm install

# Start in development mode (Electron + HMR)
npm run dev

# Run tests
npm test
```

## Scripts

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Launch Electron in dev mode with Vite HMR        |
| `npm run build`      | Compile & bundle for production                  |
| `npm run preview`    | Preview the production build locally             |
| `npm run typecheck`  | Run `tsc --noEmit` (strict)                      |
| `npm test`           | Run all Vitest tests (verbose)                   |
| `npm run test:watch` | Run Vitest in watch mode                         |
| `npm run test:coverage` | Run tests with V8 coverage                   |
| `npm run lint`       | ESLint check                                     |
| `npm run format`     | Prettier format                                  |

## Architecture

```
src/
├── main/              # Electron main process
│   ├── index.ts        ← app entry, BrowserWindow creation
│   ├── ipc/            ← IPC handler registrations
│   └── services/       ← native services (storage, updater, etc.)
├── preload/           # Preload scripts
│   └── index.ts        ← contextBridge + typed API surface
├── renderer/          # React app (Vite-bundled)
│   ├── App.tsx         ← root component
│   ├── index.tsx       ← createRoot entry
│   ├── components/     ← reusable UI components
│   ├── pages/          ← route-level page components
│   ├── hooks/          ← custom React hooks
│   ├── store/          ← Zustand state stores
│   ├── styles/         ← Tailwind CSS entry + globals
│   └── utils/          ← pure helpers / formatters
└── shared/            # Cross-process types & constants
    └── types.ts        ← IPC channel names, response types, ElectronAPI
```

### Key Design Decisions

| Concern              | Choice                                                              |
| -------------------- | ------------------------------------------------------------------- |
| Process isolation    | `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true` |
| IPC pattern          | `contextBridge` + `ipcRenderer.invoke` / `ipcMain.handle`          |
| Bundler              | **Vite** via `electron-vite`                                        |
| Styling              | **Tailwind CSS** (utility-first)                                    |
| State management     | **Zustand**                                                         |
| Routing              | **React Router v6**                                                 |
| Accessible primitives| **Radix UI**                                                        |
| Forms                | **React Hook Form** + **Zod** validation                           |
| Testing              | **Vitest** + **React Testing Library** (`jsdom`)                    |

### Path Aliases

Configured in both `tsconfig.json` and `vitest.config.ts`:

| Alias       | Resolves to        |
| ----------- | ------------------ |
| `@/*`       | `src/renderer/*`   |
| `@main/*`   | `src/main/*`       |
| `@shared/*` | `src/shared/*`     |
| `@preload/*`| `src/preload/*`    |

### Environment Configuration

Environment-specific variables live in `.env.*` files at the project root:

- `.env` – defaults (development)
- `.env.development` – local dev overrides
- `.env.staging` – staging builds
- `.env.production` – production builds

Key variables: `NODE_ENV`, `APP_STAGE`, `API_BASE_URL`.
