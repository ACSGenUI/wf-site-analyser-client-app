# WF Site Analyser — Claude Code Project Memory

## Project overview

Electron desktop app for analysing web-site UI competency.
Stack: **Electron 41 + React 19 + TypeScript + Vite + Tailwind CSS + Zustand + Radix UI**.

Full architecture in [`README.md`](README.md).

---

## Available skills

Skills live in `.claude/skills/`. Invoke them with `/skill-name [argument]`.

### `/figma-tokens <figma-url>`

Extracts design tokens from a Figma file and syncs them into the project.

- Fetches colors, typography, spacing, radii, and shadows via the Figma REST API.
- Updates `tokens/*.json` source files.
- Rebuilds `src/renderer/styles/tokens.css` via `npm run build:tokens`.
- Syncs `src/renderer/components/theme.ts` and `tailwind.config.ts`.

Use when Figma designs change **or** when setting up tokens in a fresh project.
Requires a Figma personal access token (prompted if not in `.env` as `FIGMA_TOKEN`).

Full reference: [`docs/design-tokens.md`](docs/design-tokens.md)

---

### `/tdd-story <story-id>`

Implements a user story using TDD.

- Reads `stories/**/<story-id>*.md` for acceptance criteria and test cases.
- Finds the test file specified in the story.
- Implements the component until all Vitest tests are green.
- Never modifies test files.

Example: `/tdd-story SA-601`

---

## Key conventions

### File placement
| Type | Path |
|---|---|
| Reusable components | `src/renderer/components/` |
| Feature screens | `src/renderer/features/<area>/` |
| Zustand stores | `src/renderer/store/` |
| Custom hooks | `src/renderer/hooks/` |
| Shared types | `src/shared/types.ts` |
| Tests | `src/renderer/__tests__/<area>/` |

### Tech choices
- **Tailwind CSS** — utility classes only, no inline styles, no CSS modules.
- **Zustand** — for all shared/global state.
- **Radix UI** — for accessible primitives (Dialog, Switch, Select, DropdownMenu, Tabs).
- **React Hook Form + Zod** — for all forms.
- **window.api** — all Electron IPC calls; never import `electron` directly in the renderer.

### Design tokens
- Edit `tokens/*.json` — never `src/renderer/styles/tokens.css` (auto-generated).
- Always include `px` units in spacing, font-size, and border-radius token values.
- Rebuild after any token edit: `npm run build:tokens`.

### Testing
- Test runner: **Vitest** with `jsdom`.
- Assertion library: **React Testing Library**.
- Run a single test file: `npx vitest run <path> --reporter=verbose`.
- Never skip or modify a test file to make it pass.

---

## Useful commands

```bash
npm run dev            # Electron dev mode with HMR
npm run build:tokens   # Rebuild CSS custom properties from tokens/*.json
npm test               # Run all tests
npx tsc --noEmit       # Type-check without building
npm run lint           # ESLint
```
