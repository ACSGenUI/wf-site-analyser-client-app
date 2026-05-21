---
name: project-design-system
description: SA-102 Design System & Component Library — status, conventions, known issues, and Storybook setup
metadata:
  type: project
---

SA-102 design system is fully implemented and all 37 acceptance tests pass.

**Why:** P0 critical-path sprint item to establish a shared design language for the Electron app.

**How to apply:** When building feature screens, import components from `@/components/` and use the token-backed Tailwind classes (e.g. `bg-primary-600`, `text-neutral-900`, `shadow-subtle`).

## Token system

- Source: `tokens/*.json` (Style Dictionary format)
- Generated CSS: `src/renderer/styles/tokens.css` — **never edit directly**
- JS/TS consumers: `src/renderer/components/theme.ts` exports `tokens` and `darkTokens`
- Tailwind mapping: `tailwind.config.ts` maps every token into Tailwind extensions

## Components (all in `src/renderer/components/`)

| Component | Variants / notes                                       |
| --------- | ------------------------------------------------------ | ------------------------------ |
| Button    | primary, secondary, ghost, disabled, loading           |
| Input     | default, label, error, disabled; aria-invalid on error |
| Card      | generic wrapper; rounded-lg + border + shadow-subtle   |
| Badge     | default, success, warning, error, info                 |
| Toggle    | Radix Switch; checked/unchecked/disabled               |
| Select    | native `<select>`; label, error, disabled              |
| Table     | columns + rows props; empty state                      |
| Modal     | Radix Dialog; open/onClose/title props                 |
| Drawer    | CSS slide-in; side=left                                | right; Radix not used (custom) |
| Toast     | default, success, warning, error; optional onDismiss   |

## Storybook

- Framework: `@storybook/react-vite` v8
- Config: `.storybook/main.ts` + `.storybook/preview.ts`
- Stories: `src/stories/*.stories.tsx` (one file per component)
- Run: `npm run storybook` (port 6006)
- Build: `npm run build-storybook`
- The `viteFinal` hook in `main.ts` registers the `@` alias pointing to `src/renderer/`

## vitest ESM fix (critical)

`@vitejs/plugin-react` v5+ is ESM-only. Do **not** import it in `vitest.config.ts`.
Fix: use `esbuild: { jsx: 'automatic' }` in `vitest.config.ts` instead of the plugin — esbuild handles JSX in tests; the plugin is only needed for HMR in Vite dev server.

## Dark mode

`darkTokens` is exported from `theme.ts` with inverted neutral scale and adjusted semantic colors. The `.dark` class strategy is wired in `tailwind.config.ts` (`darkMode: 'class'`). Full dark-mode CSS custom property overrides are a follow-up item.

## Pre-existing TS errors

Many test files import feature components (`@/features/analysis/...`, `@/store/...`) that are not yet implemented. These errors pre-date SA-102 and are unrelated to the design system.
