# WF Site Analyser — Agent Context

This file describes the project's automated workflows so any AI agent can perform them consistently, regardless of the tool being used.

## Project overview

Electron desktop app for analysing web-site UI competency.
Stack: **Electron 41 + React 19 + TypeScript + Vite + Tailwind CSS + Zustand + Radix UI**.

Full architecture in [`README.md`](README.md).

---

## Automated workflows

### 1. Sync design tokens from Figma

**When:** Figma designs have changed, or you are setting up tokens in a fresh project.
**Full procedure:** `.claude/skills/figma-tokens/SKILL.md`
**Reference doc:** `docs/design-tokens.md`

**Summary of steps:**

1. Extract the Figma file ID from the URL (segment between `/design/` and the next `/`).
2. Obtain a Figma personal access token — check `.env` for `FIGMA_TOKEN`, otherwise ask the user.
3. Fetch the file tree: `curl -H "X-Figma-Token: <TOKEN>" "https://api.figma.com/v1/files/<FILE_ID>?depth=10"`.
4. Attempt the variables endpoint (`/variables/local`) — if it returns an error, fall back to node-tree extraction.
5. Run the extraction script in the skill file to mine colors, typography, spacing, radii, and shadows.
6. Read each file in `tokens/` before editing, then update with the extracted values.
7. Rebuild: `npm run build:tokens`.
8. Verify `src/renderer/styles/tokens.css` has correct `--wf-*` CSS custom properties with `px` units.
9. Confirm `src/renderer/styles/index.css` imports `tokens.css` as its first line.
10. Update `src/renderer/components/theme.ts` and `tailwind.config.ts` with changed values.

**Constraints:**
- Never commit or log the Figma token.
- Never edit `src/renderer/styles/tokens.css` directly — it is auto-generated.
- Always include `px` units in spacing, font-size, and border-radius token values.
- Never add composite typography objects (they serialize as `[object Object]` in CSS).
- If the Figma file is empty, stop and report — do not overwrite existing tokens.

---

### 2. Implement a user story with TDD

**When:** A story file exists under `stories/` and needs a component built.
**Full procedure:** `.claude/skills/tdd-story/SKILL.md`

**Summary of steps:**

1. Find and read `stories/**/<story-id>*.md` — note acceptance criteria and the test file path.
2. Read the test file fully — every `describe`, `it()`, and assertion.
3. Create the component and any supporting files (store slices, hooks, types).
4. Run the test file: `npx vitest run <path> --reporter=verbose`.
5. Fix failures one at a time by changing the component, not the test.
6. Repeat until all tests are green.
7. Run the full area test suite to catch regressions.

**Constraints:**
- Never modify a test file.
- Never skip or comment out a test case.
- The story is done only when every test case passes.

---

## File placement conventions

| Type | Path |
|---|---|
| Reusable components | `src/renderer/components/` |
| Feature screens | `src/renderer/features/<area>/` |
| Zustand stores | `src/renderer/store/` |
| Custom hooks | `src/renderer/hooks/` |
| Shared types | `src/shared/types.ts` |
| Tests | `src/renderer/__tests__/<area>/` |
| Design token sources | `tokens/*.json` |
| Generated CSS tokens | `src/renderer/styles/tokens.css` |

## Tech conventions

- **Styling:** Tailwind CSS utility classes only — no inline styles, no CSS modules.
- **State:** Zustand for all shared/global state.
- **Accessible primitives:** Radix UI (Dialog, Switch, Select, DropdownMenu, Tabs).
- **Forms:** React Hook Form + Zod validation.
- **IPC:** `window.api` for all Electron calls — never import `electron` in the renderer.
- **Testing:** Vitest + React Testing Library + jsdom.

## Common commands

```bash
npm run dev            # Start Electron in dev mode with HMR
npm run build:tokens   # Rebuild CSS custom properties from tokens/*.json
npm test               # Run all Vitest tests
npx tsc --noEmit       # Type-check
npm run lint           # ESLint
npm run format         # Prettier
```
